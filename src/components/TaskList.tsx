import React from 'react';
import { List, Typography, Paper, Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import TaskItem from './TaskItem';
import { Task } from '../types/Task';

/**
 * TaskListコンポーネントのプロパティ
 */
interface TaskListProps {
  /**
   * 表示するタスクの配列
   */
  tasks: Task[];
  
  /**
   * タスクの完了状態を切り替える関数
   * @param id タスクのID
   */
  onToggleTask: (id: string) => void;
  
  /**
   * タスクを削除する関数
   * @param id タスクのID
   */
  onDeleteTask: (id: string) => void;
  
  /**
   * ローディング状態
   */
  loading?: boolean;
}

/**
 * タスクリストを表示するコンポーネント
 * タスクの一覧表示と空の状態の処理を行います
 */
const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask, loading = false }) => {
  // テーマとメディアクエリの取得
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // タスクが空かつローディング中でない場合の表示
  if (tasks.length === 0 && !loading) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: isMobile ? 2 : 3, 
          textAlign: 'center',
          bgcolor: 'background.default',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: isMobile ? 1 : 2,
        }}
      >
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontSize: isMobile ? '1rem' : '1.1rem',
          }}
        >
          タスクがありません
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mt: 1,
            fontSize: isMobile ? '0.875rem' : '1rem',
          }}
        >
          新しいタスクを追加してください
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: isMobile ? 1 : 2,
        overflow: 'hidden',
        // モバイルでは影を軽減
        boxShadow: isMobile ? '0 1px 3px rgba(0,0,0,0.12)' : undefined,
      }}
    >
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: isMobile ? 2 : 3 
        }}>
          <CircularProgress size={isMobile ? 28 : 24} />
        </Box>
      ) : (
        <List sx={{ 
          p: 0,
          // モバイルでのスクロール時の慣性スクロールを有効化
          WebkitOverflowScrolling: 'touch',
          // モバイルでのタスクリストの最大高さを設定（スクロール可能に）
          maxHeight: isMobile ? 'calc(100vh - 250px)' : 'none',
          overflowY: isMobile ? 'auto' : 'visible',
        }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TaskList;