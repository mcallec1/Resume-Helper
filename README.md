# Resume Helper

A modern application that helps users optimize their resumes for specific job descriptions using AI. Built with React and Python/CrewAI.

## Features

- Upload resume in PDF format
- Provide job description URL
- Get an optimized resume tailored to the job
- Receive interview questions and talking points
- Modern, gaming-inspired UI design

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Lucide React for icons
- React PDF viewer
- Axios for API calls

### Backend
- FastAPI
- CrewAI for AI agents
- Python PDF processing
- CORS middleware

## Getting Started

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the server:
```bash
python main.py
```

## Development

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.