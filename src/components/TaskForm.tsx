import React, { useState } from 'react';
import { Box, TextField, Button, Alert, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * TaskFormコンポーネントのプロパティ
 */
interface TaskFormProps {
  /**
   * タスク追加時に呼び出されるコールバック関数
   * @param text 追加するタスクのテキスト
   */
  onAddTask: (text: string) => void;
  
  /**
   * エラーメッセージ（存在する場合）
   */
  error?: string | null;
}

/**
 * タスク入力フォームコンポーネント
 * ユーザーが新しいタスクを入力して追加するためのフォームを提供します
 */
const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, error }) => {
  // タスクテキストの状態
  const [taskText, setTaskText] = useState('');
  // バリデーションエラーの状態
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // テーマとメディアクエリの取得
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * フォーム送信ハンドラー
   * @param e フォーム送信イベント
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 入力値のバリデーション
    if (!taskText.trim()) {
      setValidationError('タスクのテキストを入力してください');
      return;
    }
    
    // バリデーションが成功したらタスクを追加
    onAddTask(taskText);
    // フォームをリセット
    setTaskText('');
    // バリデーションエラーをクリア
    setValidationError(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: isMobile ? 2 : 3 }}>
      {/* バリデーションエラーメッセージ */}
      {validationError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            fontSize: isMobile ? '0.875rem' : '1rem',
            '& .MuiAlert-icon': {
              fontSize: isMobile ? '1.25rem' : '1.5rem',
            }
          }}
        >
          {validationError}
        </Alert>
      )}
      
      {/* エラーメッセージ（親コンポーネントから渡される） */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            fontSize: isMobile ? '0.875rem' : '1rem',
            '& .MuiAlert-icon': {
              fontSize: isMobile ? '1.25rem' : '1.5rem',
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 1 
      }}>
        <TextField
          fullWidth
          variant="outlined"
          label="新しいタスク"
          placeholder="タスクを入力してください"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          error={!!validationError}
          helperText={validationError || ' '}
          size={isMobile ? "medium" : "small"}
          inputProps={{ 
            maxLength: 200,
            style: { 
              fontSize: isMobile ? '1rem' : 'inherit',
            }
          }}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: isMobile ? '1rem' : 'inherit',
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ 
            minWidth: isMobile ? '100%' : '100px',
            minHeight: isMobile ? '48px' : 'auto',
            fontSize: isMobile ? '1rem' : 'inherit',
          }}
        >
          追加
        </Button>
      </Box>
    </Box>
  );
};

export default TaskForm;