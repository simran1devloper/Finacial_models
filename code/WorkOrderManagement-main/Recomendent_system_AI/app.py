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





















# from fastapi import FastAPI, HTTPException
# import numpy as np
# import pandas as pd
# import pickle
# from sklearn.metrics.pairwise import cosine_similarity

# app = FastAPI()

# # Step 1: Load the datasets (assuming they are stored as CSV files)
# vendors_df = pd.read_csv('vendors_b4.csv')
# work_orders_df = pd.read_csv('work_orders_b4.csv')
# ratings_df = pd.read_csv('ratings_b4.csv')

# # Step 2: One-Hot Encoding for Categorical Features
# # Convert categorical variables like 'specialization' into numerical form
# encoder = pickle.load(open('onehotencoder.pkl', 'rb'))
# specialization_encoded = encoder.transform(vendors_df[['specialization']])

# # Add one-hot encoded columns to vendors_df
# specialization_columns = encoder.get_feature_names_out(['specialization'])
# vendors_df_encoded = vendors_df.join(pd.DataFrame(specialization_encoded, columns=specialization_columns))

# # Step 3: Aggregate Ratings by averaging them for duplicate user-vendor pairs
# aggregated_ratings_df = ratings_df.groupby(['user_id', 'vendor_id']).agg({'rating': 'mean'}).reset_index()

# # Step 4: Creating the User-Item Interaction Matrix
# user_item_matrix = aggregated_ratings_df.pivot(index='user_id', columns='vendor_id', values='rating').fillna(0)

# # Step 5: Collaborative Filtering (User-Based)
# user_similarity = cosine_similarity(user_item_matrix)

# # Predict ratings: dot product of user similarity and user-item interaction matrix
# user_predicted_ratings = user_similarity.dot(user_item_matrix) / np.array([np.abs(user_similarity).sum(axis=1)]).T

# # Step 6: Content-Based Filtering using Cosine Similarity
# vendor_features = vendors_df_encoded.drop(['vendor_id', 'vendor_name', 'specialization'], axis=1).values
# similarity_matrix = cosine_similarity(vendor_features)

# # Calculate similarity scores between vendors and each user
# user_vendor_sim = user_item_matrix.dot(similarity_matrix)

# # Step 7: Hybrid Model - Combine both scores
# hybrid_scores = 0.5 * user_predicted_ratings + 0.5 * user_vendor_sim

# # Step 8: Generate Top 5 Recommendations for a User
# def get_top_5_recommendations(user_id):
#     if user_id not in user_item_matrix.index:
#         raise HTTPException(status_code=404, detail="User ID not found")
    
#     user_index = user_item_matrix.index.get_loc(user_id)
#     sorted_vendors = np.argsort(-hybrid_scores[user_index])  # Sort vendors by descending score
#     top_5_vendor_ids = user_item_matrix.columns[sorted_vendors][:5]
#     top_5_vendors = vendors_df[vendors_df['vendor_id'].isin(top_5_vendor_ids)][['vendor_name', 'specialization']].values
#     return top_5_vendors

# @app.get("/recommendations/{user_id}")
# def recommend_vendors(user_id: int):
#     try:
#         recommendations = get_top_5_recommendations(user_id)
#         return {"user_id": user_id, "recommendations": [{"vendor_name": rec[0], "specialization": rec[1]} for rec in recommendations]}
#     except HTTPException as e:
#         return {"error": str(e.detail)}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
