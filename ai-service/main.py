from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from prediction.anomaly_prediction import predict_anomaly
from prediction.risk_prediction import predict_structural_risk
from prediction.crack_prediction import predict_crack_from_bytes

app = FastAPI(
    title="AI Structural Health Monitoring & Risk Assessment Service",
    description="Python FastAPI AI microservice providing Isolation Forest anomaly detection, ML risk scoring, and OpenCV crack detection.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DISCLAIMER = "AI-based preliminary structural assessment only. Results are intended for academic and monitoring support purposes and must not replace inspection, testing, or certification by a qualified structural engineer."


class SensorPayload(BaseModel):
    structureId: Optional[str] = "str-001"
    temperature: float
    humidity: float
    vibration: float
    displacement: float
    strain: float
    crackWidth: float


class RiskPayload(BaseModel):
    structureId: Optional[str] = "str-001"
    age_years: Optional[float] = 15.0
    material_rating: Optional[float] = 4.0
    vibration: float
    displacement: float
    strain: float
    crack_width: float
    anomaly_count: Optional[int] = 1


@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "service": "Python FastAPI AI Structural Monitoring Microservice",
        "endpoints": ["/predict/anomaly", "/predict/risk", "/predict/crack"],
        "disclaimer": DISCLAIMER
    }


@app.post("/predict/anomaly")
def predict_sensor_anomaly(payload: SensorPayload):
    try:
        result = predict_anomaly(payload.dict())
        return {"success": True, "structureId": payload.structureId, "data": result, "disclaimer": DISCLAIMER}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/risk")
def predict_risk(payload: RiskPayload):
    try:
        result = predict_structural_risk(payload.dict())
        return {"success": True, "structureId": payload.structureId, "data": result, "disclaimer": DISCLAIMER}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/crack")
async def predict_crack(file: UploadFile = File(...), structureId: str = "str-001"):
    try:
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP images are accepted.")

        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size exceeds 10MB limit.")

        result = predict_crack_from_bytes(contents)
        return {
            "success": True,
            "structureId": structureId,
            "filename": file.filename,
            "data": result,
            "disclaimer": DISCLAIMER
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
