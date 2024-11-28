import React from 'react';
import { MessageCircle, List } from 'lucide-react';
import { InterviewPrep as InterviewPrepType } from '../types';

interface InterviewPrepProps {
  prep: InterviewPrepType;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ prep }) => {
  return (
    <div className="space-y-6">
      <div className="gradient-border">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="text-[#ff2ec7]" />
            <h3 className="text-xl font-semibold text-white">Potential Interview Questions</h3>
          </div>
          <ul className="space-y-3">
            {prep.questions.map((question, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-[#ff2ec7] font-medium">{index + 1}.</span>
                <span className="text-gray-300">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="gradient-border">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <List className="text-[#4f46e5]" />
            <h3 className="text-xl font-semibold text-white">Key Talking Points</h3>
          </div>
          <ul className="space-y-3">
            {prep.talkingPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-[#4f46e5]">•</span>
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}