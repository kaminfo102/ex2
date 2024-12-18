```typescript
import React from 'react';
import { useQuery } from 'react-query';
import api from '../../../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserAnalytics() {
  const { data: analytics } = useQuery('user-analytics', async () => {
    const { data } = await api.get('/admin/analytics/users');
    return data;
  });

  if (!analytics) return <div>در حال بارگذاری...</div>;

  const registrationData = {
    labels: analytics.registration_trend.map((item: any) => item.date),
    datasets: [{
      label: 'ثبت‌نام کاربران',
      data: analytics.registration_trend.map((item: any) => item.count),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">کل کاربران</h3>
          <p className="text-3xl font-bold">{analytics.total_users}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">کاربران فعال امروز</h3>
          <p className="text-3xl font-bold">{analytics.active_today}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">میانگین آزمون در ماه</h3>
          <p className="text-3xl font-bold">{analytics.average_exams_per_month}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">روند ثبت‌نام کاربران</h3>
        <Line data={registrationData} />
      </div>
    </div>
  );
}
```