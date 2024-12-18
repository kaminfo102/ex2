
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../utils/api';

interface Props {
  onDistributionChange: (distribution: any) => void;
  categoryId?: number;
}

export default function QuestionDistribution({ onDistributionChange, categoryId }: Props) {
  const [distribution, setDistribution] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });

  const { data: questionStats } = useQuery(
    ['question-stats', categoryId],
    async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId.toString());
      const { data } = await api.get(`/questions/stats?${params.toString()}`);
      return data;
    }
  );

  const handleChange = (level: string, value: number) => {
    const newDistribution = { ...distribution, [level]: value };
    setDistribution(newDistribution);
    onDistributionChange(newDistribution);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(distribution).map(([level, count]) => (
          <div key={level} className="card">
            <h3 className="text-lg font-semibold mb-2">
              سوالات {level === 'easy' ? 'آسان' : level === 'medium' ? 'متوسط' : 'سخت'}
            </h3>
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="number"
                min="0"
                max={questionStats?.[level] || 999}
                value={count}
                onChange={(e) => handleChange(level, parseInt(e.target.value))}
                className="input w-24"
              />
              <span className="text-sm text-gray-500">
                از {questionStats?.[level] || 0} سوال موجود
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          مجموع سوالات انتخاب شده: {Object.values(distribution).reduce((a, b) => a + b, 0)} سوال
        </p>
      </div>
    </div>
  );
}
