import React from 'react';
import { Container, Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useTasks } from '../hooks/useTasks';

/**
 * メインのToDoアプリケーションコンポーネント
 * タスク管理の状態とUIを統合します
 */
const TodoApp: React.FC = () => {
  // タスク管理のカスタムフックを使用
  const { tasks, addTask, toggleTask, deleteTask, loading, error } = useTasks();
  
  // テーマとメディアクエリの取得
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        px: isMobile ? 1 : 2,
      }}
    >
      <Box sx={{ 
        mb: isMobile ? 2 : 4,
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom
          sx={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: 600
          }}
        >
          タスク管理
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            mb: isMobile ? 1 : 2
          }}
        >
          タスクを追加、完了、削除して効率的に管理しましょう
        </Typography>
      </Box>

      {/* タスク入力フォーム */}
      <TaskForm onAddTask={addTask} error={error} />

      {/* タスクリスト */}
      <TaskList
        tasks={tasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        loading={loading}
      />
    </Container>
  );
};

export default TodoApp;