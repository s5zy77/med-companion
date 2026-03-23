import time
import asyncio
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="MedNote Scan-to-3D API")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChromaSpecs(BaseModel):
    hex_code: str
    glow_intensity: float

class OCRArtifacts(BaseModel):
    medication_name: str
    dosage: str
    frequency: str
    imprint_text: str

class SpatialMetadata(BaseModel):
    mesh_primitive: str
    chroma_specs: ChromaSpecs
    spatial_scale: List[float]
    ocr_artifacts: OCRArtifacts

@app.post("/analyze-prescription", response_model=SpatialMetadata)
async def analyze_prescription(file: UploadFile = File(...)):
    """
    Simulated 'Scan-to-3D' endpoint for the hackathon demo.
    Adds a 2-second delay to fake heavy AI processing.
    """
    # Simulate heavy deep learning and computer vision processing
    await asyncio.sleep(2.0)
    
    # Return a high-fidelity, hardcoded spatial metadata for "Metformin"
    return SpatialMetadata(
        mesh_primitive="capsule",
        chroma_specs=ChromaSpecs(
            hex_code="#34d399",  # A nice emerald green often used for medical glowing effects
            glow_intensity=0.85
        ),
        spatial_scale=[2.5, 0.8, 0.8], # [x, y, z] representing an elongated capsule
        ocr_artifacts=OCRArtifacts(
            medication_name="Metformin HCL",
            dosage="500mg",
            frequency="Take 1 tablet twice daily with meals",
            imprint_text="194"
        )
    )

if __name__ == "__main__":
    import uvicorn
    # Make sure to pip install fastapi uvicorn pydantic python-multipart
    uvicorn.run(app, host="0.0.0.0", port=8000)
