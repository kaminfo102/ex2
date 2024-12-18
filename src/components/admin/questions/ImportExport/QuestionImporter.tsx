import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';
import { parseQuestionFile } from '../../../../utils/questionParser';

export default function QuestionImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const importMutation = useMutation(
    async (questions: any[]) => {
      await api.post('/questions/import', { questions });
    },
    {
      onSuccess: () => {
        toast.success('سوالات با موفقیت وارد شدند');
        setFile(null);
        setPreview([]);
      },
      onError: () => {
        toast.error('خطا در وارد کردن سوالات');
      }
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const questions = await parseQuestionFile(selectedFile);
      setFile(selectedFile);
      setPreview(questions);
    } catch (error) {
      toast.error('خطا در خواندن فایل');
    }
  };

  const handleImport = () => {
    if (preview.length > 0) {
      importMutation.mutate(preview);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept=".json,.xlsx,.csv"
          onChange={handleFileChange}
          className="hidden"
          id="question-import"
        />
        <label
          htmlFor="question-import"
          className="flex flex-col items-center cursor-pointer"
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="mt-2 text-gray-600">انتخاب فایل برای بارگذاری</span>
          <span className="text-sm text-gray-500 mt-1">
            فرمت‌های پشتیبانی شده: JSON, Excel, CSV
          </span>
        </label>
      </div>

      {preview.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">پیش‌نمایش سوالات ({preview.length} سوال)</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {preview.map((question, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                <p className="font-medium">{question.question_text}</p>
                <p className="text-sm text-gray-600 mt-1">
                  سطح دشواری: {question.difficulty_level}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleImport}
            className="btn-primary w-full"
            disabled={importMutation.isLoading}
          >
            {importMutation.isLoading ? 'در حال وارد کردن...' : 'وارد کردن سوالات'}
          </button>
        </div>
      )}
    </div>
  );
}