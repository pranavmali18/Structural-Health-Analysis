"""
Training Script for AI Structural Anomaly Detection Model
Algorithm: Isolation Forest (scikit-learn)
Feature Space: [temperature, humidity, vibration, displacement, strain, crack_width]
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def train_anomaly_model():
    print("[AI Training] Generating synthetic structural telemetry dataset for Isolation Forest...")
    np.random.seed(42)

    # 1. Generate Normal Telemetry Samples (95% of data)
    n_normal = 2000
    temp_normal = np.random.uniform(22.0, 36.0, n_normal)
    humidity_normal = np.random.uniform(40.0, 85.0, n_normal)
    vibration_normal = np.random.normal(2.0, 0.5, n_normal)
    vibration_normal = np.clip(vibration_normal, 0.5, 4.5)
    displacement_normal = np.random.normal(1.2, 0.3, n_normal)
    displacement_normal = np.clip(displacement_normal, 0.1, 3.5)
    strain_normal = np.random.normal(220.0, 40.0, n_normal)
    strain_normal = np.clip(strain_normal, 50.0, 450.0)
    crack_normal = np.random.uniform(0.0, 0.8, n_normal)

    df_normal = pd.DataFrame({
        'temperature': temp_normal,
        'humidity': humidity_normal,
        'vibration': vibration_normal,
        'displacement': displacement_normal,
        'strain': strain_normal,
        'crackWidth': crack_normal
    })

    # 2. Generate Anomalous Telemetry Samples (5% of data)
    n_anomaly = 100
    temp_anomaly = np.random.uniform(15.0, 42.0, n_anomaly)
    humidity_anomaly = np.random.uniform(20.0, 95.0, n_anomaly)
    vibration_anomaly = np.random.uniform(6.0, 15.0, n_anomaly) # High vibration spike
    displacement_anomaly = np.random.uniform(4.5, 8.0, n_anomaly) # Excessive deflection
    strain_anomaly = np.random.uniform(550.0, 900.0, n_anomaly) # High strain stress
    crack_anomaly = np.random.uniform(1.2, 3.5, n_anomaly) # Critical crack expansion

    df_anomaly = pd.DataFrame({
        'temperature': temp_anomaly,
        'humidity': humidity_anomaly,
        'vibration': vibration_anomaly,
        'displacement': displacement_anomaly,
        'strain': strain_anomaly,
        'crackWidth': crack_anomaly
    })

    df_full = pd.concat([df_normal, df_anomaly], ignore_index=True)

    # Save dataset CSV to datasets/
    os.makedirs('datasets', exist_ok=True)
    df_full.to_csv('datasets/sensor_data.csv', index=False)
    print(f"[AI Training] Dataset saved to datasets/sensor_data.csv ({len(df_full)} rows)")

    # 3. Train Isolation Forest
    X = df_full[['temperature', 'humidity', 'vibration', 'displacement', 'strain', 'crackWidth']]
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42,
        verbose=0
    )
    model.fit(X)

    # 4. Save trained model to models/
    os.makedirs('models', exist_ok=True)
    model_path = 'models/anomaly_model.pkl'
    joblib.dump(model, model_path)
    print(f"[AI Training] Isolation Forest model trained and saved to {model_path} successfully!")

if __name__ == '__main__':
    train_anomaly_model()
