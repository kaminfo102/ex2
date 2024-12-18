import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { formatJalaliDateTime } from '../../utils/date';

export default function UserExams() {
  const { data: exams, isLoading } = useQuery('user-exams', async () => {
    const { data } = await api.get('/user/exams');
    return data;
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="space-y-4">
      {exams?.map((exam: any) => (
        <div key={exam.exam_id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{exam.exam_title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {exam.exam_description}
              </p>
            </div>
            <div className="text-left">
              <span className="text-sm text-gray-500">
                {formatJalaliDateTime(exam.start_time)}
              </span>
              {exam.score && (
                <p className="text-lg font-bold text-blue-600 mt-1">
                  نمره: {exam.score}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            {!exam.started ? (
              <a
                href={`/exams/${exam.exam_id}/take`}
                className="btn-primary"
              >
                شروع آزمون
              </a>
            ) : exam.completed ? (
              <a
                href={`/exams/${exam.exam_id}/result`}
                className="btn-secondary"
              >
                مشاهده نتیجه
              </a>
            ) : (
              <a
                href={`/exams/${exam.exam_id}/take`}
                className="btn-primary"
              >
                ادامه آزمون
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}