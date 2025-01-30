from fastapi import FastAPI, Query
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import pandas as pd
import time
from selenium.common.exceptions import NoSuchElementException
from typing import Optional

app = FastAPI()

class Item(BaseModel):
    name: str

@app.post("/scrape/")
async def scrape(item: Item):
    path = "/Users/HN085WS/Downloads/chromedriver-win64/chromedriver-win64/chromedriver.exe"
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Enable headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    service = Service(path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    website = "https://www.labx.com/product"
    driver.get(website)

    search_input = driver.find_element(By.XPATH, '//input[@name="sw"]')
    search_input.send_keys(item.name)
    search_input.send_keys(Keys.RETURN)

    # Wait for the elements to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//span[@class="red-numbers svelte-cdavil"]'))
    )

    real_val_new = 0
    real_val_used = 0

    checking = driver.find_element(By.XPATH, '//span[@class="red-numbers svelte-cdavil"]')
    checking_num = checking.text
    if checking_num != '0':
        try:
            checkbox_used = driver.find_element(By.XPATH, "//input[@type='checkbox'][@value='467_Used']")
            driver.execute_script("arguments[0].click();", checkbox_used)
            time.sleep(5)

            val_used_elements = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'card-text-price') or contains(@class, 'card-text-inquire')]"))
            )
            for value in val_used_elements:
                if value.text != 'Please Inquire':
                    real_val_used = value.text
                    break

            # Deselect the checkbox if selected
            if checkbox_used.is_selected():
                driver.execute_script("arguments[0].click();", checkbox_used)
        except NoSuchElementException:
            pass

        try:
            time.sleep(5)
            checkbox_new = driver.find_element(By.XPATH, "//input[@type='checkbox'][@value='468_New']")
            driver.execute_script("arguments[0].click();", checkbox_new)
            time.sleep(5)

            val_new_elements = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'card-text-price') or contains(@class, 'card-text-inquire')]"))
            )
            for value in val_new_elements:
                if value.text != 'Please Inquire':
                    real_val_new = value.text
                    break
        except NoSuchElementException:
            pass

    df = pd.DataFrame({'New_Value': [real_val_new], 'Used_value': [real_val_used]})
    df.to_excel("laboutput.xlsx", index=False)
    time.sleep(10)
    driver.quit()

    return {"New_Value": real_val_new, "Used_Value": real_val_used}

