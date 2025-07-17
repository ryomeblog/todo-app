import { CssBaseline, ThemeProvider, createTheme, Box, AppBar, Toolbar, Typography, useMediaQuery, responsiveFontSizes } from '@mui/material';
import TodoApp from './components/TodoApp';

// MUIテーマの作成
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '600px',
          padding: '0 16px',
          '@media (max-width: 600px)': {
            padding: '0 12px',
          },
        },
      },
    },
    // タッチデバイス向けのボタンサイズ調整
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          '@media (max-width: 600px)': {
            padding: '12px 20px', // モバイル向けに大きめのボタン
            minHeight: '48px', // タッチターゲットを大きく
          },
        },
      },
    },
    // タッチデバイス向けのアイコンボタンサイズ調整
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '12px', // モバイル向けに大きめのアイコンボタン
            fontSize: '1.2rem', // アイコンサイズを大きく
          },
        },
      },
    },
    // チェックボックスのサイズ調整
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '12px', // モバイル向けに大きめのチェックボックス
          },
        },
      },
    },
    // リストアイテムのタッチ領域を広げる
    MuiListItem: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            paddingTop: '12px',
            paddingBottom: '12px',
          },
        },
      },
    },
    // フォーム要素のタッチ領域を広げる
    MuiTextField: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            '& .MuiInputBase-input': {
              padding: '14px 12px',
            },
          },
        },
      },
    },
  },
  // レスポンシブ設定
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  // タイポグラフィのレスポンシブ設定
  typography: {
    h5: {
      fontWeight: 600,
      '@media (max-width: 600px)': {
        fontSize: '1.4rem',
      },
    },
    body1: {
      '@media (max-width: 600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      '@media (max-width: 600px)': {
        fontSize: '0.875rem',
      },
    },
  },
});

// レスポンシブフォントサイズを適用
theme = responsiveFontSizes(theme);

function App() {
  // モバイルビューかどうかを判定
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={isMobile ? 0 : 1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ToDoアプリ
            </Typography>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ 
          flexGrow: 1, 
          py: isMobile ? 2 : 3,
          px: isMobile ? 1 : 2,
        }}>
          <TodoApp />
        </Box>
        <Box component="footer" sx={{ 
          py: 2, 
          textAlign: 'center',
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ToDoアプリ
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;