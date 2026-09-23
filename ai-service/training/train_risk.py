"""
Training Script for AI Structural Risk Scoring Model
Algorithm: Random Forest Regressor (scikit-learn)
Target Output: Structural Risk Index Score (0.0 to 100.0)
Features: [age_years, material_rating, vibration, displacement, strain, crack_width, anomaly_count]
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

def train_risk_model():
    print("[AI Risk Training] Generating synthetic structural risk dataset...")
    np.random.seed(42)
    n_samples = 1500

    age = np.random.uniform(1.0, 75.0, n_samples)
    material_rating = np.random.uniform(1.0, 5.0, n_samples) # 1=low durability, 5=high steel/prestressed
    vibration = np.random.uniform(0.5, 15.0, n_samples)
    displacement = np.random.uniform(0.1, 8.0, n_samples)
    strain = np.random.uniform(50.0, 850.0, n_samples)
    crack_width = np.random.uniform(0.0, 3.5, n_samples)
    anomaly_count = np.random.randint(0, 15, n_samples)

    # Formulate domain-based civil structural risk scoring function for ground truth labels
    risk_score = (
        (age / 75.0) * 15.0 +
        ((5.0 - material_rating) / 4.0) * 10.0 +
        (vibration / 15.0) * 25.0 +
        (displacement / 8.0) * 15.0 +
        (strain / 850.0) * 20.0 +
        (crack_width / 3.5) * 15.0
    )

    risk_score = np.clip(risk_score, 0.0, 100.0)

    df = pd.DataFrame({
        'age_years': age,
        'material_rating': material_rating,
        'vibration': vibration,
        'displacement': displacement,
        'strain': strain,
        'crack_width': crack_width,
        'anomaly_count': anomaly_count,
        'risk_score': risk_score
    })

    os.makedirs('datasets', exist_ok=True)
    df.to_csv('datasets/risk_data.csv', index=False)
    print(f"[AI Risk Training] Risk dataset saved to datasets/risk_data.csv ({len(df)} records)")

    X = df.drop(columns=['risk_score'])
    y = df['risk_score']

    model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X, y)

    os.makedirs('models', exist_ok=True)
    model_path = 'models/risk_model.pkl'
    joblib.dump(model, model_path)
    print(f"[AI Risk Training] Random Forest Risk Model saved to {model_path} successfully!")

if __name__ == '__main__':
    train_risk_model()
