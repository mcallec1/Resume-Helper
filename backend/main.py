from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-resume")
async def process_resume(
    resume: UploadFile,
    job_url: str = Form(...)
):
    try:
        # Read the PDF content
        content = await resume.read()
        
        # TODO: Add your CrewAI processing logic here
        
        # For now, return mock data
        return {
            "status": "success",
            "updatedResume": {
                "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            "interviewPrep": {
                "questions": [
                    "Can you explain your experience with Python?",
                    "How do you handle complex problems?",
                    "Tell me about a challenging project"
                ],
                "talkingPoints": [
                    "Strong Python background",
                    "Problem-solving skills",
                    "Project management experience"
                ]
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)