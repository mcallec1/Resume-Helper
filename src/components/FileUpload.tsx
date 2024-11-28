import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = ['.pdf'],
  maxSize = 5242880, // 5MB
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': acceptedFileTypes,
    },
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all
        ${isDragActive 
          ? 'border-[#ff2ec7] bg-[#ff2ec7]/10' 
          : 'border-gray-700 hover:border-[#4f46e5] hover:bg-[#4f46e5]/5'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-gray-300">
        <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-[#ff2ec7]' : 'text-[#4f46e5]'}`} />
        <p className="text-lg font-medium">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your resume here'}
        </p>
        <p className="text-sm mt-2">or click to select a file</p>
        <p className="text-xs mt-2 text-gray-500">PDF files only, max 5MB</p>
      </div>
    </div>
  );
}