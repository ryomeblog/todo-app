import React from 'react';
import { 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction, 
  IconButton, 
  Checkbox, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/Task';

/**
 * TaskItemコンポーネントのプロパティ
 */
interface TaskItemProps {
  /**
   * 表示するタスク
   */
  task: Task;
  
  /**
   * タスクの完了状態を切り替える関数
   * @param id タスクのID
   */
  onToggle: (id: string) => void;
  
  /**
   * タスクを削除する関数
   * @param id タスクのID
   */
  onDelete: (id: string) => void;
}

/**
 * 個別のタスク項目を表示するコンポーネント
 * タスクの表示、完了状態の切り替え、削除機能を提供します
 */
const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  // テーマとメディアクエリの取得
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // タスクの作成日をフォーマット
  const formattedDate = new Date(task.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ListItem
      divider
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 1,
        py: isMobile ? 1.5 : 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
        // モバイルでのタップ時のフィードバック
        '&:active': isMobile ? {
          bgcolor: 'action.selected',
        } : {},
      }}
    >
      {/* 完了状態のチェックボックス */}
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          inputProps={{ 'aria-labelledby': `task-${task.id}` }}
          color="primary"
          sx={{
            // モバイルでのタッチ領域を広げる
            padding: isMobile ? '12px' : '8px',
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.25rem',
            },
          }}
        />
      </ListItemIcon>
      
      {/* タスクのテキストと作成日 */}
      <ListItemText
        id={`task-${task.id}`}
        primary={
          <Typography
            variant="body1"
            component="span"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              fontSize: isMobile ? '1rem' : 'inherit',
              // 長いテキストの場合に省略表示
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {task.text}
          </Typography>
        }
        secondary={
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.75rem' : '0.7rem',
              mt: 0.5,
            }}
          >
            {formattedDate}
          </Typography>
        }
        sx={{
          mr: isMobile ? 6 : 4, // 削除ボタンのスペースを確保
        }}
      />
      
      {/* 削除ボタン */}
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(task.id)}
          size={isMobile ? "medium" : "small"}
          color="error"
          sx={{
            // モバイルでのタッチ領域を広げる
            padding: isMobile ? '12px' : '8px',
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.25rem',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TaskItem;