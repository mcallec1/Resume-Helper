import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { JobUrlInput } from './components/JobUrlInput';
import { ProcessingStatus } from './components/ProcessingStatus';
import { InterviewPrep } from './components/InterviewPrep';
import { UpdatedResume } from './components/UpdatedResume';
import { Resume, InterviewPrep as InterviewPrepType } from './types';
import { Gamepad2, Wand2 } from 'lucide-react';
import { resumeApi } from './api/resumeApi';

// Mock data for demonstration
const mockInterviewPrep: InterviewPrepType = {
  questions: [
    "Can you explain how you've handled complex data analysis projects in your previous role?",
    "What experience do you have with machine learning algorithms?",
    "How do you stay updated with the latest industry trends?",
    "Tell me about a challenging project you've worked on and how you overcame obstacles.",
    "What's your approach to collaborating with cross-functional teams?"
  ],
  talkingPoints: [
    "Strong background in Python and data visualization",
    "Experience with TensorFlow and PyTorch frameworks",
    "Led a team of 3 junior data scientists",
    "Implemented automated reporting system that saved 20 hours per week",
    "Published research paper on predictive analytics"
  ]
};

function App() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrepType | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [jobUrl, setJobUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const processResume = async (file: File, url: string) => {
    try {
      setError(null);
      setResume({
        id: Date.now().toString(),
        originalFile: file,
        status: 'processing'
      });

      const response = await resumeApi.processResume(file, url);
      
      setResume(prev => prev ? { 
        ...prev, 
        status: 'completed',
        updatedPdfUrl: response.updatedResume.url 
      } : null);
      
      setInterviewPrep(response.interviewPrep);
      setIsProcessingComplete(true);
    } catch (err) {
      setError('Failed to process resume. Please try again.');
      setResume(prev => prev ? { ...prev, status: 'error' } : null);
      console.error('Error processing resume:', err);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!jobUrl) {
      setError('Please provide a job URL first');
      return;
    }
    processResume(file, jobUrl);
  };

  const handleJobUrl = (url: string) => {
    setJobUrl(url);
    setError(null);
  };

  // Demo function to simulate file upload
  const handleDemoClick = () => {
    const mockFile = new File([""], "mock-resume.pdf", { type: "application/pdf" });
    setJobUrl('https://example.com/mock-job');
    processResume(mockFile, 'https://example.com/mock-job');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-8 w-8 text-[#ff2ec7]" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff2ec7] to-[#4f46e5] text-transparent bg-clip-text">
                Resume Helper
              </h1>
            </div>
            {!isProcessingComplete && (
              <button
                onClick={handleDemoClick}
                className="flex items-center space-x-2 px-4 py-2 bg-[#2a2a2a] rounded-lg text-gray-300 
                         hover:bg-[#3a3a3a] transition-colors border border-gray-700"
              >
                <Wand2 className="text-[#ff2ec7]" size={18} />
                <span>Try Demo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {!isProcessingComplete ? (
              <>
                <div className="gradient-border">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Upload Your Resume</h2>
                    <FileUpload onFileSelect={handleFileSelect} />
                    {resume && (
                      <div className="mt-4">
                        <ProcessingStatus 
                          status={resume.status} 
                          message={error || undefined} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="gradient-border">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Job Description</h2>
                    <JobUrlInput onSubmit={handleJobUrl} />
                  </div>
                </div>
              </>
            ) : (
              <UpdatedResume pdfUrl={resume?.updatedPdfUrl || ''} />
            )}
          </div>

          <div className="space-y-6">
            {interviewPrep && <InterviewPrep prep={interviewPrep} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;