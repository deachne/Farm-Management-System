import React from 'react';
import { StatCardProps } from './types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  change,
}) => {
  // Determine background color based on first letter of label
  const getBackgroundColor = () => {
    if (!label) return 'bg-blue-50 dark:bg-blue-900/10';
    
    const firstChar = label.charAt(0).toLowerCase();
    
    if (['a', 'b', 'c'].includes(firstChar)) return 'bg-blue-50 dark:bg-blue-900/10';
    if (['d', 'e', 'f'].includes(firstChar)) return 'bg-purple-50 dark:bg-purple-900/10';
    if (['g', 'h', 'i'].includes(firstChar)) return 'bg-green-50 dark:bg-green-900/10';
    if (['j', 'k', 'l'].includes(firstChar)) return 'bg-yellow-50 dark:bg-yellow-900/10';
    if (['m', 'n', 'o'].includes(firstChar)) return 'bg-indigo-50 dark:bg-indigo-900/10';
    if (['p', 'q', 'r'].includes(firstChar)) return 'bg-pink-50 dark:bg-pink-900/10';
    if (['s', 't', 'u'].includes(firstChar)) return 'bg-teal-50 dark:bg-teal-900/10';
    if (['v', 'w', 'x', 'y', 'z'].includes(firstChar)) return 'bg-orange-50 dark:bg-orange-900/10';
    
    return 'bg-blue-50 dark:bg-blue-900/10';
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-start">
        <div className={`mr-4 p-3 rounded-md ${getBackgroundColor()}`}>
          <div className="text-2xl text-blue-600 dark:text-blue-400">{icon}</div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          {change.type === 'increase' && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 mr-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {change.value}% <span className="text-xs font-normal opacity-70">{change.period}</span>
              </span>
            </div>
          )}
          
          {change.type === 'decrease' && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 mr-2">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {change.value}% <span className="text-xs font-normal opacity-70">{change.period}</span>
              </span>
            </div>
          )}
          
          {change.type === 'no-change' && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 mr-2">
                <Minus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No change <span className="text-xs font-normal opacity-70">{change.period}</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
