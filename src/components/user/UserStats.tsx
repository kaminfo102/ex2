
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

export default function UserStats() {
  const { data: stats } = useQuery('user-stats', async () => {
    const { data } = await api.get('/user/stats');
    return data;
  });

  const statItems = [
    {
      title: 'آزمون‌های شرکت کرده',
      value: stats?.total_exams || 0,
      icon: '📝'
    },
    {
      title: 'میانگین نمرات',
      value: stats?.average_score?.toFixed(2) || 0,
      icon: '📊'
    },
    {
      title: 'بهترین نمره',
      value: stats?.best_score || 0,
      icon: '🏆'
    },
    {
      title: 'آزمون‌های در انتظار',
      value: stats?.pending_exams || 0,
      icon: '⏳'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{item.title}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
            <span className="text-2xl">{item.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
