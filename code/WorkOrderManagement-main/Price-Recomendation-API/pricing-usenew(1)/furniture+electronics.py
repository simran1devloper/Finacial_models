from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import requests
import re

app = FastAPI()

class SearchQuery(BaseModel):
    search_for: str

def generate_url(part1, part2, search_for, ch):
    url = part1
    list1 = list(search_for)
    l = len(list1)
    for i in range(l):
        if list1[i] == ' ':
            list1[i] = ch
        url = url + list1[i]
    url = url + part2
    return url

@app.post("/scrape/")
async def scrape(query: SearchQuery):
    search_for = query.search_for
    amazon_url = generate_url('https://www.amazon.in/s?k=', '&ref=nb_sb_noss_1', search_for, '+')
    fl_url = generate_url('https://www.flipkart.com/search?q=', '&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off', search_for, '%20')

    headers = {
        "Host": "www.amazon.in",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    }
    headers2 = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
        "Accept-Encoding": "gzip, deflate",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "DNT": "1",
        "Connection": "close",
        "Upgrade-Insecure-Requests": "1"
    }

    r1 = requests.get(amazon_url, headers=headers)
    r2 = requests.get(fl_url, headers=headers2)

    if r1.status_code != 200 or r2.status_code != 200:
        return {"error": "Sorry cannot fetch data for this product right now!!"}

    content2 = r2.content
    content = r1.content
    soup2 = BeautifulSoup(content2, 'lxml')
    soup1 = BeautifulSoup(content, 'lxml')

    data = {
        "Sold By": [],
        "Product Info": [],
        "Price": [],
        "Link To Site": []
    }

    # Get new
    cnt = 0
    for t in soup1.find_all('span', attrs={'class': 'a-size-medium a-color-base a-text-normal'}):
        text = t.get_text(strip=True)
        if text:
            data["Sold By"].append('Amazon')
            data["Product Info"].append(text)
            cnt += 1
            if cnt == 5:
                break
    if len(data["Sold By"]) == 0:
        for t in soup1.find_all('span', attrs={'class': 'a-size-base-plus a-color-base a-text-normal'}):
            text = t.get_text(strip=True)
            if text:
                data["Sold By"].append('Amazon')
                data["Product Info"].append(text)
                cnt += 1
                if cnt == 5:
                    break

    cnt = 0
    for t in soup1.find_all('span', attrs={'class': 'a-price-whole'}):
        text = t.get_text(strip=True)
        if text:
            data["Price"].append(t.get_text())
            cnt += 1
            if cnt == 5:
                break

    cnt = 0
    for t in soup1.find_all('a', attrs={'class': 'a-link-normal a-text-normal', 'href': re.compile("^https://www.amazon.in/")}, href=True):
        data["Link To Site"].append(t.get('href'))
        cnt += 1
        if cnt == 5:
            break

    # Get used
    max_length = max(len(lst) for lst in data.values())
    for key in data:
        while len(data[key]) < max_length:
            data[key].append(None)

    def convert_to_numeric(value):
        try:
            return int(value)
        except ValueError:
            return 0

    numeric_values = [int(value.replace(',', '')) for value in data['Price']]
    data['Price'] = [convert_to_numeric(v) for v in numeric_values]
    expected_price = np.mean(data['Price'])

    df = pd.DataFrame({'Price': data['Price']})
    df.to_excel("furniture+elec.xlsx", index=False)

    return {"Expected_Price": expected_price}
