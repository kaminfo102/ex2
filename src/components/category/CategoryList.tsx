import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import CategoryCard from './CategoryCard';
import CategoryTree from './CategoryTree';
import ClientProvider from '../providers/ClientProvider';
import { AxiosError } from 'axios';

// Types
interface Category {
  category_id: number;
  title: string;
  description?: string;
  parent_id: number | null;
  icon?: string;
  exam_count?: number;
  children?: Category[];
}

interface ErrorMessageProps {
  error: string;
}


// Components
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px]" role="status" aria-label="loading">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="text-center text-red-600 p-4 rounded-lg bg-red-50" role="alert">
    <p className="font-semibold">خطا در دریافت اطلاعات:</p>
    <p className="text-sm mt-1">{error}</p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center text-gray-600 p-4" role="status">
    هیچ دسته‌بندی‌ای یافت نشد.
  </div>
);

const CategoryListContent: React.FC = () => {
  const { 
    data: categories, 
    isLoading, 
    isError,
    error 
  } = useQuery<Category[], AxiosError>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.get('/categories');
        return response.data;
      } catch (error) {
        throw error instanceof AxiosError ? error : new Error('خطای ناشناخته');
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error?.message || 'خطای ناشناخته'} />;
  }

  if (!categories?.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">ساختار درختی</h2>
        <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300">
          <CategoryTree categories={categories} />
        </div>
      </section>
      
      <section className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">لیست دسته‌بندی‌ها</h2>
        <div className="space-y-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300">
          {categories.map((category) => (
            <CategoryCard 
              key={category.category_id} 
              category={category} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const CategoryList: React.FC = () => {
  return (
    <ClientProvider>
      <CategoryListContent />
    </ClientProvider>
  );
};

export default CategoryList;
