from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
import pickle

app = FastAPI()

class UserRequest(BaseModel):
    user_id: int

with open('onehotencoder.pkl', 'rb') as f:
    encoder = pickle.load(f)

user_item_matrix = pd.read_pickle('user_item_matrix.pkl')
user_similarity = np.load('user_similarity.npy')
vendor_similarity = np.load('vendor_similarity.npy')

vendors_df = pd.read_csv('vendors_b4.csv')

def get_top_5_recommendations(user_id):
    if user_id not in user_item_matrix.index:
        raise HTTPException(status_code=404, detail="User ID not found")
    
    user_index = user_item_matrix.index.get_loc(user_id)
    user_predicted_ratings = user_similarity.dot(user_item_matrix) / np.array([np.abs(user_similarity).sum(axis=1)]).T
    user_vendor_sim = user_item_matrix.dot(vendor_similarity)
    hybrid_scores = 0.5 * user_predicted_ratings + 0.5 * user_vendor_sim

    sorted_vendors = np.argsort(-hybrid_scores[user_index])  
    top_5_vendor_ids = user_item_matrix.columns[sorted_vendors][:5]
    top_5_vendors = vendors_df[vendors_df['vendor_id'].isin(top_5_vendor_ids)][['vendor_name', 'specialization']].values
    return top_5_vendors

@app.post("/recommendations/")
def recommend_vendors(request: UserRequest):
    try:
        recommendations = get_top_5_recommendations(request.user_id)
        return {"user_id": request.user_id, "recommendations": [{"vendor_name": rec[0], "specialization": rec[1]} for rec in recommendations]}
    except HTTPException as e:
        return {"error": str(e.detail)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






