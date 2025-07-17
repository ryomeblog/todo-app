import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/Task';
import { useLocalStorage } from './useLocalStorage';

/**
 * タスク管理のためのカスタムフック
 * タスクの追加、完了状態の切り替え、削除などの機能を提供します
 * 
 * @returns タスク操作のための関数と状態
 */
export const useTasks = () => {
  // LocalStorageを使用してタスクを永続化
  const [tasks, setTasks] = useLocalStorage<Task[]>('todoApp_tasks', []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 新しいタスクを追加する
   * @param text タスクのテキスト
   */
  const addTask = useCallback((text: string) => {
    if (!text.trim()) {
      setError('タスクのテキストを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newTask: Task = {
        id: uuidv4(),
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      };
      
      setTasks((currentTasks) => [...currentTasks, newTask]);
    } catch (err) {
      setError('タスクの追加中にエラーが発生しました');
      console.error('タスク追加エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  /**
   * タスクの完了状態を切り替える
   * @param id 切り替えるタスクのID
   */
  const toggleTask = useCallback((id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      setTasks((currentTasks) => 
        currentTasks.map((task) => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (err) {
      setError('タスクの状態変更中にエラーが発生しました');
      console.error('タスク状態変更エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  /**
   * タスクを削除する
   * @param id 削除するタスクのID
   */
  const deleteTask = useCallback((id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('タスクの削除中にエラーが発生しました');
      console.error('タスク削除エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    loading,
    error
  };
};