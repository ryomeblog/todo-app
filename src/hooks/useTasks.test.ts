import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTasks } from './useTasks';
import { Task } from '../types/Task';

// モックLocalStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// UUIDをモック
vi.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

// useLocalStorageフックをモック
vi.mock('./useLocalStorage', () => ({
  useLocalStorage: <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
    const [state, setState] = vi.importActual('react').useState<T>(
      mockLocalStorage.getItem(key) 
        ? JSON.parse(mockLocalStorage.getItem(key) as string) 
        : initialValue
    );
    
    const setValue = (value: T | ((val: T) => T)) => {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      mockLocalStorage.setItem(key, JSON.stringify(valueToStore));
    };
    
    return [state, setValue];
  }
}));

describe('useTasks', () => {
  beforeEach(() => {
    // 各テスト前にLocalStorageをモックしてクリア
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('初期状態では空のタスク配列を返す', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('タスクを追加できる', () => {
    const { result } = renderHook(() => useTasks());
    
    // 日付をモック
    const mockDate = new Date('2023-01-01T00:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);
    
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    expect(result.current.tasks).toEqual([
      {
        id: 'test-uuid',
        text: 'テストタスク',
        completed: false,
        createdAt: mockDate
      }
    ]);
    
    // LocalStorageに保存されたことを確認
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'todoApp_tasks',
      JSON.stringify([{
        id: 'test-uuid',
        text: 'テストタスク',
        completed: false,
        createdAt: mockDate
      }])
    );
    
    // モックをリストア
    vi.restoreAllMocks();
  });

  it('空のタスクテキストを追加しようとするとエラーになる', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask('');
    });
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toBe('タスクのテキストを入力してください');
    // LocalStorageは呼ばれないことを確認
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('空白のみのタスクテキストを追加しようとするとエラーになる', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask('   ');
    });
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toBe('タスクのテキストを入力してください');
  });

  it('タスクの完了状態を切り替えられる', () => {
    const { result } = renderHook(() => useTasks());
    
    // タスクを追加
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    // 完了状態を切り替え
    act(() => {
      result.current.toggleTask('test-uuid');
    });
    
    expect(result.current.tasks[0].completed).toBe(true);
    
    // LocalStorageに更新されたことを確認
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'todoApp_tasks',
      expect.any(String)
    );
    expect(JSON.parse(mockLocalStorage.setItem.mock.calls[1][1])[0].completed).toBe(true);
    
    // もう一度切り替え
    act(() => {
      result.current.toggleTask('test-uuid');
    });
    
    expect(result.current.tasks[0].completed).toBe(false);
    expect(JSON.parse(mockLocalStorage.setItem.mock.calls[2][1])[0].completed).toBe(false);
  });

  it('存在しないタスクIDで切り替えを試みても何も起きない', () => {
    const { result } = renderHook(() => useTasks());
    
    // タスクを追加
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    // 存在しないIDで切り替え
    act(() => {
      result.current.toggleTask('non-existent-id');
    });
    
    // 変更がないことを確認
    expect(result.current.tasks[0].completed).toBe(false);
    // LocalStorageは呼ばれるが、データは変わらない
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('タスクを削除できる', () => {
    const { result } = renderHook(() => useTasks());
    
    // タスクを追加
    act(() => {
      result.current.addTask('テストタスク1');
    });
    
    // 2つ目のタスクを追加するためにUUIDモックを変更
    const originalV4 = vi.fn().mockReturnValue('test-uuid');
    const newV4 = vi.fn().mockReturnValue('test-uuid-2');
    
    // UUIDモックを一時的に変更
    vi.mock('uuid', () => ({
      v4: () => 'test-uuid-2'
    }), { virtual: true });
    
    // 2つ目のタスクを追加
    act(() => {
      result.current.addTask('テストタスク2');
    });
    
    // タスクを削除
    act(() => {
      result.current.deleteTask('test-uuid');
    });
    
    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].text).toBe('テストタスク2');
    
    // LocalStorageに更新されたことを確認
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'todoApp_tasks',
      expect.any(String)
    );
  });

  it('存在しないタスクIDで削除を試みても何も起きない', () => {
    const { result } = renderHook(() => useTasks());
    
    // タスクを追加
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    // 存在しないIDで削除
    act(() => {
      result.current.deleteTask('non-existent-id');
    });
    
    // 変更がないことを確認
    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].text).toBe('テストタスク');
  });

  it('LocalStorageからタスクを読み込む', () => {
    // LocalStorageにタスクを設定
    const storedTasks = [
      {
        id: 'stored-uuid',
        text: '保存されたタスク',
        completed: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedTasks));
    
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([
      {
        id: 'stored-uuid',
        text: '保存されたタスク',
        completed: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ]);
  });

  it('複数のタスクを追加できる', () => {
    const { result } = renderHook(() => useTasks());
    
    // 日付をモック
    const mockDate = new Date('2023-01-01T00:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);
    
    // 1つ目のタスクを追加
    act(() => {
      result.current.addTask('テストタスク1');
    });
    
    // UUIDモックを変更
    vi.mock('uuid', () => ({
      v4: () => 'test-uuid-2'
    }), { virtual: true });
    
    // 2つ目のタスクを追加
    act(() => {
      result.current.addTask('テストタスク2');
    });
    
    expect(result.current.tasks).toEqual([
      {
        id: 'test-uuid',
        text: 'テストタスク1',
        completed: false,
        createdAt: mockDate
      },
      {
        id: 'test-uuid-2',
        text: 'テストタスク2',
        completed: false,
        createdAt: mockDate
      }
    ]);
    
    // モックをリストア
    vi.restoreAllMocks();
  });

  it('エラー状態がリセットされる', () => {
    const { result } = renderHook(() => useTasks());
    
    // エラーを発生させる
    act(() => {
      result.current.addTask('');
    });
    
    expect(result.current.error).toBe('タスクのテキストを入力してください');
    
    // 正常なタスクを追加するとエラーがリセットされる
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    expect(result.current.error).toBeNull();
  });

  it('ローディング状態が適切に変化する', () => {
    const { result } = renderHook(() => useTasks());
    
    // 非同期処理をシミュレート
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    
    // setTimeoutをモック
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = vi.fn((callback) => {
      promise.then(() => callback());
      return 1 as unknown as NodeJS.Timeout;
    });
    
    // タスクを追加
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    // ローディング状態を確認
    expect(result.current.loading).toBe(false);
    
    // モックを元に戻す
    global.setTimeout = originalSetTimeout;
  });

  it('例外が発生した場合にエラー状態が設定される', () => {
    const { result } = renderHook(() => useTasks());
    
    // setTasksでエラーを発生させる
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mock('./useLocalStorage', () => ({
      useLocalStorage: () => {
        const setState = () => { throw new Error('テストエラー'); };
        return [[], setState];
      }
    }), { virtual: true });
    
    // タスクを追加しようとする
    act(() => {
      result.current.addTask('テストタスク');
    });
    
    // エラー状態を確認
    expect(result.current.error).toBe('タスクの追加中にエラーが発生しました');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});