import React from 'react';
import { Download, FileText } from 'lucide-react';

interface UpdatedResumeProps {
  pdfUrl: string;
}

export const UpdatedResume: React.FC<UpdatedResumeProps> = ({ pdfUrl }) => {
  return (
    <div className="gradient-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-[#ff2ec7]" />
            <h3 className="text-xl font-semibold text-white">Updated Resume</h3>
          </div>
          <a
            href={pdfUrl}
            download="updated-resume.pdf"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ff2ec7] to-[#4f46e5] 
                     rounded-lg text-white hover:opacity-90 transition-opacity"
          >
            <Download size={18} />
            <span>Download PDF</span>
          </a>
        </div>
        <div className="mt-4 p-4 bg-[#2a2a2a] rounded-lg">
          <iframe
            src={pdfUrl}
            className="w-full h-[400px] rounded border border-gray-700"
            title="Updated Resume Preview"
          />
        </div>
      </div>
    </div>
  );
}