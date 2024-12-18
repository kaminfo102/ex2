
import React from 'react';
import { Question } from '../../../types';

interface Props {
  examData: {
    exam_title: string;
    exam_description: string;
    start_time: string;
    end_time: string;
    is_paid: boolean;
    price?: number;
  };
  selectedQuestions: Question[];
}

export default function ExamPreview({ examData, selectedQuestions }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">{examData.exam_title}</h2>
        <p className="text-gray-600 mb-4">{examData.exam_description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">زمان شروع:</span>
            <p className="font-medium">{new Date(examData.start_time).toLocaleString('fa-IR')}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">زمان پایان:</span>
            <p className="font-medium">{new Date(examData.end_time).toLocaleString('fa-IR')}</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span>نوع آزمون:</span>
          <span className={examData.is_paid ? 'text-yellow-600' : 'text-green-600'}>
            {examData.is_paid ? `${examData.price?.toLocaleString()} تومان` : 'رایگان'}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">سوالات آزمون</h3>
        <div className="space-y-4">
          {selectedQuestions.map((question, index) => (
            <div key={question.question_id} className="p-4 border rounded">
              <div className="flex justify-between">
                <span className="font-medium">سوال {index + 1}</span>
                <span className={`px-2 py-1 rounded text-sm
                  ${question.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}
                >
                  {question.difficulty_level === 'easy' ? 'آسان' :
                   question.difficulty_level === 'medium' ? 'متوسط' : 'سخت'}
                </span>
              </div>
              <p className="mt-2">{question.question_text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
