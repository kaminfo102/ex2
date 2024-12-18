import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder } from 'react-feather';

interface Category {
  category_id: number;
  category_name: string;
  parent_id?: number;
  children?: Category[];
  description?: string;
  item_count?: number;
}

interface Props {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
}

function buildTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category>();
  const tree: Category[] = [];

  categories.forEach(category => {
    categoryMap.set(category.category_id, { ...category, children: [] });
  });

  categories.forEach(category => {
    const node = categoryMap.get(category.category_id);
    if (node) {
      if (category.parent_id && categoryMap.has(category.parent_id)) {
        const parent = categoryMap.get(category.parent_id);
        parent?.children?.push(node);
      } else {
        tree.push(node);
      }
    }
  });

  const sortNodes = (nodes: Category[]) => {
    nodes.sort((a, b) => a.category_name.localeCompare(b.category_name));
    nodes.forEach(node => {
      if (node.children?.length) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(tree);
  return tree;
}

function TreeNode({ 
  node, 
  level = 0, 
  onSelect,
  selectedId 
}: { 
  node: Category; 
  level?: number; 
  onSelect?: (category: Category) => void;
  selectedId?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.category_id === selectedId;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect?.(node);
  };

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center py-2 px-2 rounded-md cursor-pointer
          hover:bg-gray-100 transition-colors duration-150
          ${isSelected ? 'bg-blue-50 text-blue-600' : ''}
        `}
        style={{ marginRight: `${level * 20}px` }}
        onClick={handleSelect}
      >
        <button 
          onClick={handleToggle}
          className={`w-6 h-6 flex items-center justify-center mr-1
                     text-gray-500 hover:bg-gray-200 rounded-full
                     ${!hasChildren ? 'invisible' : ''}`}
        >
          {hasChildren && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </button>

        <div className={`w-6 h-6 flex items-center justify-center mr-2 
                        text-gray-500 transition-transform duration-200
                        ${isExpanded ? 'transform rotate-3' : ''}`}>
          <Folder size={18} />
        </div>

        <div className="flex flex-col flex-1">
          <span className="text-sm font-medium">{node.category_name}</span>
          {node.description && (
            <span className="text-xs text-gray-500">{node.description}</span>
          )}
        </div>

        {node.item_count !== undefined && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            {node.item_count}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="mr-2">
          {node.children?.map(child => (
            <TreeNode 
              key={child.category_id} 
              node={child} 
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const CategoryTree: React.FC<Props> = ({ categories, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const tree = buildTree(categories);

  const handleSelect = (category: Category) => {
    setSelectedCategory(category.category_id);
    onSelectCategory?.(category);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="space-y-1">
        {tree.map(node => (
          <TreeNode 
            key={node.category_id} 
            node={node}
            onSelect={handleSelect}
            selectedId={selectedCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTree;
