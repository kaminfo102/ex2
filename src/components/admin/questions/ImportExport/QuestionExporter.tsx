import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../../../utils/api';
import { exportToExcel, exportToJson, exportToCsv } from '../../../../utils/exportHelpers';

type ExportFormat = 'json' | 'excel' | 'csv';

export default function QuestionExporter() {
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { data: categories } = useQuery('categories', async () => {
    const { data } = await api.get('/categories');
    return data;
  });

  const handleExport = async () => {
    try {
      const { data: questions } = await api.get('/questions/export', {
        params: { categories: selectedCategories }
      });

      switch (format) {
        case 'excel':
          exportToExcel(questions, 'questions');
          break;
        case 'json':
          exportToJson(questions, 'questions');
          break;
        case 'csv':
          exportToCsv(questions, 'questions');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          فرمت خروجی
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          className="input"
        >
          <option value="excel">Excel</option>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          دسته‌بندی‌ها
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories?.map((category: any) => (
            <label key={category.category_id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.category_id)}
                onChange={(e) => {
                  setSelectedCategories(prev =>
                    e.target.checked
                      ? [...prev, category.category_id]
                      : prev.filter(id => id !== category.category_id)
                  );
                }}
                className="ml-2"
              />
              {category.category_name}
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleExport} className="btn-primary w-full">
        دریافت خروجی
      </button>
    </div>
  );
}