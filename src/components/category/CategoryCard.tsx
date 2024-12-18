import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface Category {
  category_id: number;
  title: string;
  description?: string;
  parent_id?: number | null;
  icon?: string;
  exam_count?: number;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const queryClient = useQueryClient();
  
  const { mutate: deleteCategory, isLoading } = useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/categories/${id}`);
      } catch (error) {
        throw new Error('خطا در حذف دسته‌بندی');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('دسته‌بندی با موفقیت حذف شد');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'خطا در حذف دسته‌بندی');
    }
  });

  const handleEdit = () => {
    // استفاده از window.location به جای router
    window.location.href = `/admin/categories/${category.category_id}/edit`;
  };

  const handleDelete = async () => {
    if (window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      deleteCategory(category.category_id);
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {category.title}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {category.exam_count !== undefined && (
              <span>تعداد آزمون: {category.exam_count}</span>
            )}
            {category.parent_id && (
              <span>دسته‌بندی والد: {category.parent_id}</span>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 
                     rounded-md hover:bg-blue-100 transition-colors"
            disabled={isLoading}
          >
            ویرایش
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 
                     rounded-md hover:bg-red-100 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'در حال حذف...' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
