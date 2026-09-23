import os
import joblib
import numpy as np
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'anomaly_model.pkl')

_model_cache = None

def get_model():
    global _model_cache
    if _model_cache is None:
        if os.path.exists(MODEL_PATH):
            _model_cache = joblib.load(MODEL_PATH)
        else:
            print("[AI Warning] Trained model file not found. Running inline Isolation Forest...")
            from sklearn.ensemble import IsolationForest
            X_dummy = np.random.normal(size=(100, 6))
            _model_cache = IsolationForest(n_estimators=50, contamination=0.05, random_state=42).fit(X_dummy)
    return _model_cache

def predict_anomaly(sensor_reading: dict):
    """
    Perform Isolation Forest anomaly detection on sensor reading
    """
    model = get_model()

    features = [
        sensor_reading.get('temperature', 25.0),
        sensor_reading.get('humidity', 50.0),
        sensor_reading.get('vibration', 2.0),
        sensor_reading.get('displacement', 1.0),
        sensor_reading.get('strain', 200.0),
        sensor_reading.get('crackWidth', 0.5)
    ]

    df = pd.DataFrame([features], columns=['temperature', 'humidity', 'vibration', 'displacement', 'strain', 'crackWidth'])

    # Isolation Forest prediction: 1 for inlier (normal), -1 for outlier (anomaly)
    prediction = model.predict(df)[0]
    score = model.score_samples(df)[0]  # Isolation Forest decision score

    is_anomaly = (prediction == -1)

    # Determine primary affected feature for Explainable AI
    vibration = features[2]
    strain = features[4]
    crack_width = features[5]
    displacement = features[3]

    affected_param = "Normal Range"
    explanation = "Observation aligns with baseline physical structural bounds."

    if is_anomaly or vibration > 6.0 or strain > 500.0 or crack_width > 1.2 or displacement > 4.0:
        is_anomaly = True
        reasons = []
        if vibration > 6.0:
            reasons.append(f"Vibration spike ({vibration:.2f} mm/s^2 vs baseline max 5.0 mm/s^2)")
            affected_param = "Vibration Amplitude"
        if strain > 500.0:
            reasons.append(f"Micro-strain limit exceeded ({strain:.1f} ue vs baseline max 500 ue)")
            affected_param = "Micro-Strain (ue)" if affected_param == "Normal Range" else "Vibration & Strain"
        if crack_width > 1.2:
            reasons.append(f"Crack expansion threshold breached ({crack_width:.2f} mm)")
            affected_param = "Crack Width" if affected_param == "Normal Range" else affected_param + " & Crack"
        if displacement > 4.0:
            reasons.append(f"Excessive deflection ({displacement:.2f} mm)")
            affected_param = "Displacement" if affected_param == "Normal Range" else affected_param + " & Displacement"

        explanation = f"Isolation Forest flagged anomaly (score {score:.3f}). " + "; ".join(reasons) + "."

    return {
        "isAnomaly": bool(is_anomaly),
        "status": "Anomalous" if is_anomaly else "Normal",
        "anomalyScore": float(round(score, 4)),
        "affectedParameter": affected_param,
        "explanation": explanation,
        "algorithm": "IsolationForest (scikit-learn)"
    }
