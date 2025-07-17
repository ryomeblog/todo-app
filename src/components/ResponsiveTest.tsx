import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  useTheme, 
  useMediaQuery,
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskItem from './TaskItem';

/**
 * レスポンシブデザインをテストするためのコンポーネント
 * 異なる画面サイズでのUIコンポーネントの表示を確認できます
 */
const ResponsiveTest: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  
  // 現在の画面サイズ情報
  const screenInfo = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'xs/sm' : isTablet ? 'sm/md' : 'md以上'
  };
  
  // モックタスクデータ
  const mockTasks = [
    {
      id: '1',
      text: '買い物リストを作成する',
      completed: false,
      createdAt: new Date()
    },
    {
      id: '2',
      text: '牛乳を買う',
      completed: true,
      createdAt: new Date(Date.now() - 86400000) // 1日前
    },
    {
      id: '3',
      text: 'レポートを提出する - これは長いタスクテキストの例で、モバイル表示での折り返しをテストします。複数行になる場合の表示を確認します。',
      completed: false,
      createdAt: new Date(Date.now() - 172800000) // 2日前
    }
  ];
  
  // モックハンドラー
  const mockHandlers = {
    onAddTask: () => console.log('タスク追加'),
    onToggleTask: () => console.log('タスク切り替え'),
    onDeleteTask: () => console.log('タスク削除'),
    onToggle: () => console.log('切り替え'),
    onDelete: () => console.log('削除')
  };
  
  const handleComponentChange = (event: SelectChangeEvent) => {
    setSelectedComponent(event.target.value as string);
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        レスポンシブデザインテスト
      </Typography>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          現在の画面情報
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">
              幅: {screenInfo.width}px
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">
              高さ: {screenInfo.height}px
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">
              ブレークポイント: {screenInfo.breakpoint}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">
              表示モード: {isMobile ? 'モバイル' : isTablet ? 'タブレット' : 'デスクトップ'}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => window.location.reload()}
            fullWidth={isMobile}
            sx={{ mt: 1 }}
          >
            画面をリロード
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="component-select-label">表示するコンポーネント</InputLabel>
          <Select
            labelId="component-select-label"
            id="component-select"
            value={selectedComponent}
            label="表示するコンポーネント"
            onChange={handleComponentChange}
          >
            <MenuItem value="all">すべて表示</MenuItem>
            <MenuItem value="taskForm">TaskForm</MenuItem>
            <MenuItem value="taskList">TaskList</MenuItem>
            <MenuItem value="taskItem">TaskItem</MenuItem>
            <MenuItem value="emptyList">空のTaskList</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {(selectedComponent === 'all' || selectedComponent === 'taskForm') && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              TaskForm コンポーネント
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TaskForm onAddTask={mockHandlers.onAddTask} />
          </CardContent>
        </Card>
      )}
      
      {(selectedComponent === 'all' || selectedComponent === 'taskList') && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              TaskList コンポーネント
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TaskList 
              tasks={mockTasks} 
              onToggleTask={mockHandlers.onToggleTask} 
              onDeleteTask={mockHandlers.onDeleteTask} 
            />
          </CardContent>
        </Card>
      )}
      
      {(selectedComponent === 'all' || selectedComponent === 'taskItem') && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              TaskItem コンポーネント
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ border: '1px solid #eee', borderRadius: 1 }}>
              {mockTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task} 
                  onToggle={mockHandlers.onToggle} 
                  onDelete={mockHandlers.onDelete} 
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
      
      {(selectedComponent === 'all' || selectedComponent === 'emptyList') && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              空の TaskList
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TaskList 
              tasks={[]} 
              onToggleTask={mockHandlers.onToggleTask} 
              onDeleteTask={mockHandlers.onDeleteTask} 
            />
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          ブラウザのサイズを変更して、各コンポーネントのレスポンシブ動作を確認してください。
          開発者ツールのデバイスエミュレーションも活用できます。
        </Typography>
      </Box>
    </Box>
  );
};

export default ResponsiveTest;