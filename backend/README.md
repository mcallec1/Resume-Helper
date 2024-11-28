# Resume Helper Backend

This is the Python backend for the Resume Helper application. It uses FastAPI and CrewAI to process resumes and job descriptions.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The server will start at http://localhost:8000

## API Endpoints

### POST /process-resume
Processes a resume and job description to provide tailored recommendations.

**Request:**
- `resume`: PDF file
- `job_url`: string (URL of the job posting)

**Response:**
```json
{
  "status": "success",
  "updatedResume": {
    "url": "path_to_updated_resume.pdf"
  },
  "interviewPrep": {
    "questions": ["..."],
    "talkingPoints": ["..."]
  }
}
```