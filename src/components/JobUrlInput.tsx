import React, { useState } from 'react';
import { Link } from 'lucide-react';

interface JobUrlInputProps {
  onSubmit: (url: string) => void;
}

export const JobUrlInput: React.FC<JobUrlInputProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste job description URL here"
          className="w-full pl-10 pr-24 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg 
                   text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent
                   transition-all"
          required
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1
                   bg-gradient-to-r from-[#ff2ec7] to-[#4f46e5] text-white rounded-md
                   hover:from-[#ff2ec7]/90 hover:to-[#4f46e5]/90 transition-all"
        >
          Submit
        </button>
      </div>
    </form>
  );
}