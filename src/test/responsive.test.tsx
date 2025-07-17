import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import TodoApp from '../components/TodoApp';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskItem from '../components/TaskItem';
import { vi } from 'vitest';

// テスト用のモックデータ
const mockTask = {
  id: '1',
  text: 'テストタスク',
  completed: false,
  createdAt: new Date()
};

const mockTasks = [mockTask];

// モックハンドラー
const mockHandlers = {
  onAddTask: vi.fn(),
  onToggleTask: vi.fn(),
  onDeleteTask: vi.fn(),
  onToggle: vi.fn(),
  onDelete: vi.fn()
};

// レスポンシブテスト用のヘルパー関数
const setScreenSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
};

// テーマプロバイダーでラップするヘルパー関数
const renderWithTheme = (component: React.ReactNode, options = {}) => {
  const theme = responsiveFontSizes(createTheme());
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>,
    options
  );
};

describe('レスポンシブデザインテスト', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TaskForm コンポーネント', () => {
    it('デスクトップ表示で正しくレンダリングされる', () => {
      setScreenSize(1024, 768);
      renderWithTheme(<TaskForm onAddTask={mockHandlers.onAddTask} />);
      
      const inputElement = screen.getByPlaceholderText('タスクを入力してください');
      const buttonElement = screen.getByRole('button', { name: /追加/i });
      
      expect(inputElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
      // デスクトップでは横並びレイアウトになっているはず
      // CSSのテストは難しいので、存在確認のみ
    });

    it('モバイル表示で正しくレンダリングされる', () => {
      setScreenSize(375, 667);
      renderWithTheme(<TaskForm onAddTask={mockHandlers.onAddTask} />);
      
      const inputElement = screen.getByPlaceholderText('タスクを入力してください');
      const buttonElement = screen.getByRole('button', { name: /追加/i });
      
      expect(inputElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
      // モバイルでは縦並びレイアウトになっているはず
      // CSSのテストは難しいので、存在確認のみ
    });
  });

  describe('TaskItem コンポーネント', () => {
    it('デスクトップ表示で正しくレンダリングされる', () => {
      setScreenSize(1024, 768);
      renderWithTheme(
        <TaskItem 
          task={mockTask} 
          onToggle={mockHandlers.onToggle} 
          onDelete={mockHandlers.onDelete} 
        />
      );
      
      expect(screen.getByText('テストタスク')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      expect(checkbox).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('モバイル表示で正しくレンダリングされる', () => {
      setScreenSize(375, 667);
      renderWithTheme(
        <TaskItem 
          task={mockTask} 
          onToggle={mockHandlers.onToggle} 
          onDelete={mockHandlers.onDelete} 
        />
      );
      
      expect(screen.getByText('テストタスク')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox');
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      expect(checkbox).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('TaskList コンポーネント', () => {
    it('デスクトップ表示でタスクが正しく表示される', () => {
      setScreenSize(1024, 768);
      renderWithTheme(
        <TaskList 
          tasks={mockTasks} 
          onToggleTask={mockHandlers.onToggleTask} 
          onDeleteTask={mockHandlers.onDeleteTask} 
        />
      );
      
      expect(screen.getByText('テストタスク')).toBeInTheDocument();
    });

    it('モバイル表示でタスクが正しく表示される', () => {
      setScreenSize(375, 667);
      renderWithTheme(
        <TaskList 
          tasks={mockTasks} 
          onToggleTask={mockHandlers.onToggleTask} 
          onDeleteTask={mockHandlers.onDeleteTask} 
        />
      );
      
      expect(screen.getByText('テストタスク')).toBeInTheDocument();
    });

    it('空のタスクリストが正しく表示される', () => {
      setScreenSize(1024, 768);
      renderWithTheme(
        <TaskList 
          tasks={[]} 
          onToggleTask={mockHandlers.onToggleTask} 
          onDeleteTask={mockHandlers.onDeleteTask} 
        />
      );
      
      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
      expect(screen.getByText('新しいタスクを追加してください')).toBeInTheDocument();
    });
  });

  // 画面サイズ変更時のレスポンシブ動作テスト
  describe('画面サイズ変更時のレスポンシブ動作', () => {
    it('画面サイズを変更するとレイアウトが適応される', () => {
      // デスクトップサイズでレンダリング
      setScreenSize(1024, 768);
      const { rerender } = renderWithTheme(
        <TaskForm onAddTask={mockHandlers.onAddTask} />
      );
      
      // 要素の存在確認
      expect(screen.getByPlaceholderText('タスクを入力してください')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /追加/i })).toBeInTheDocument();
      
      // モバイルサイズに変更して再レンダリング
      setScreenSize(375, 667);
      rerender(
        <ThemeProvider theme={responsiveFontSizes(createTheme())}>
          <TaskForm onAddTask={mockHandlers.onAddTask} />
        </ThemeProvider>
      );
      
      // 要素が引き続き存在することを確認
      expect(screen.getByPlaceholderText('タスクを入力してください')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /追加/i })).toBeInTheDocument();
    });
  });
});