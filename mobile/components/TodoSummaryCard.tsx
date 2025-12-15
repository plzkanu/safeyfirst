import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ClipboardCheck, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface TodoItem {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface TodoSummaryCardProps {
  todos: TodoItem[];
  maxItems?: number;
}

export default function TodoSummaryCard({ todos, maxItems = 3 }: TodoSummaryCardProps) {
  const displayTodos = todos.slice(0, maxItems);
  const remainingCount = todos.length - maxItems;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400';
      case 'medium':
        return 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '긴급';
      case 'medium':
        return '보통';
      default:
        return '낮음';
    }
  };

  return (
    <View className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <ClipboardCheck size={20} color="#ff8c00" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
            나의 할 일
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/inspection')}
          className="flex-row items-center"
        >
          <Text className="text-sm text-primary-600 dark:text-primary-400 mr-1">
            전체보기
          </Text>
          <ChevronRight size={16} color="#ff8c00" />
        </TouchableOpacity>
      </View>

      {displayTodos.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-gray-500 dark:text-gray-400">
            예정된 점검이 없습니다
          </Text>
        </View>
      ) : (
        <View>
          {displayTodos.map((todo, index) => (
            <View
              key={todo.id}
              className={`py-3 ${index < displayTodos.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
            >
              <View className="flex-row items-start justify-between mb-1">
                <Text className="flex-1 text-base font-medium text-gray-900 dark:text-white">
                  {todo.title}
                </Text>
                <View
                  className={`px-2 py-1 rounded-md ${getPriorityColor(todo.priority)}`}
                >
                  <Text className="text-xs font-semibold">
                    {getPriorityText(todo.priority)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center mt-1">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {todo.type}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mx-2">
                  •
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {todo.dueDate}
                </Text>
              </View>
            </View>
          ))}
          {remainingCount > 0 && (
            <View className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Text className="text-sm text-center text-primary-600 dark:text-primary-400">
                +{remainingCount}개 더 보기
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

