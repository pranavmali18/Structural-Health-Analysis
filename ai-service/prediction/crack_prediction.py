"""
AI Computer Vision Concrete Crack Detection Module
Algorithm: OpenCV Canny Edge Detection + Contour Analysis + Statistical Confidence Scoring
Accepts surface images of concrete walls, beams, columns, slabs, bridge decks
"""

import cv2
import numpy as np
from PIL import Image
import io
import os


def predict_crack_from_bytes(image_bytes: bytes) -> dict:
    """
    Main inference function for crack detection.
    Uses OpenCV Canny edge density + contour morphology analysis.
    """
    try:
        # Decode image bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image. Please upload a valid JPG/PNG file.")

        return analyze_image(img)

    except Exception as e:
        return {
            "crackDetected": False,
            "confidence": 0.0,
            "severity": "None",
            "edgeDensityRatio": 0.0,
            "recommendation": f"Image processing error: {str(e)}",
            "algorithm": "OpenCV Edge Density (Error)"
        }


def predict_crack_from_path(image_path: str) -> dict:
    """
    Inference from file path.
    """
    img = cv2.imread(image_path)
    if img is None:
        return {
            "crackDetected": False,
            "confidence": 0.0,
            "severity": "None",
            "recommendation": "Image file not found or invalid.",
            "algorithm": "OpenCV Edge Density (Error)"
        }
    return analyze_image(img)


def analyze_image(img: np.ndarray) -> dict:
    """
    Core computer vision pipeline:
    1. Convert to grayscale
    2. Apply Gaussian blur for denoising
    3. CLAHE adaptive histogram equalization for concrete surface contrast
    4. Canny edge detection for crack boundary extraction
    5. Morphological closing to connect broken crack edges
    6. Contour analysis for shape/aspect ratio classification
    7. Calculate edge density ratio as primary confidence metric
    """
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Step 1: CLAHE - Contrast Limited Adaptive Histogram Equalization
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # Step 2: Gaussian blur for surface noise reduction
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)

    # Step 3: Canny edge detection (optimized thresholds for concrete surface)
    edges = cv2.Canny(blurred, threshold1=40, threshold2=120)

    # Step 4: Morphological closing to close small crack gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    closed_edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

    # Step 5: Edge density ratio calculation
    total_pixels = h * w
    edge_pixels = np.count_nonzero(closed_edges)
    edge_density = edge_pixels / total_pixels

    # Step 6: Contour analysis
    contours, _ = cv2.findContours(closed_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_aspect_ratio = 0.0
    large_contours = [c for c in contours if cv2.contourArea(c) > 50]
    
    for cnt in large_contours:
        rect = cv2.minAreaRect(cnt)
        (w_r, h_r) = rect[1]
        if w_r > 0 and h_r > 0:
            ar = max(w_r, h_r) / min(w_r, h_r)
            max_aspect_ratio = max(max_aspect_ratio, ar)

    # Step 7: Determine crack detection and confidence score
    # Crack-like structures: elevated edge density OR high-aspect-ratio elongated contours
    is_crack = (edge_density > 0.035 and max_aspect_ratio > 2.5) or edge_density > 0.08

    # Confidence score calculation using edge density and contour features
    density_confidence = min(1.0, edge_density / 0.12)
    contour_confidence = min(1.0, max_aspect_ratio / 15.0)
    confidence = round((density_confidence * 0.65 + contour_confidence * 0.35), 3)

    if not is_crack:
        confidence = round(max(0.0, confidence * 0.35), 3)

    # Severity Classification based on edge density
    if not is_crack or confidence < 0.20:
        severity = "None"
        recommendation = "No visible crack pattern detected. Maintain standard periodic inspection schedule."
    elif edge_density < 0.055:
        severity = "Minor"
        recommendation = "Minor hairline crack pattern detected. Monitor and re-inspect in 60 days."
    elif edge_density < 0.085:
        severity = "Moderate"
        recommendation = "Moderate crack pattern detected. Perform epoxy injection and non-destructive ultrasonic testing within 14 days."
    elif edge_density < 0.12:
        severity = "Severe"
        recommendation = "Severe crack propagation detected. Restrict structural load, deploy NDT acoustic emission crew, and evaluate remediation strategy."
    else:
        severity = "Critical"
        is_crack = True
        confidence = min(1.0, confidence + 0.1)
        recommendation = "CRITICAL crack pattern detected. IMMEDIATE structural safety assessment required. Do not operate under normal load conditions."

    return {
        "crackDetected": bool(is_crack),
        "confidence": float(confidence),
        "severity": severity,
        "edgeDensityRatio": float(round(edge_density, 4)),
        "maxContourAspectRatio": float(round(max_aspect_ratio, 2)),
        "recommendation": recommendation,
        "algorithm": "OpenCV CLAHE + Canny Edge Detection + Morphological Contour Analysis",
        "disclaimer": "AI-based preliminary assessment only. Results must not replace professional structural inspection."
    }
