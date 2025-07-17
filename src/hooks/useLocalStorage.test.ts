import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

// モックLocalStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// テスト前にLocalStorageをモック
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    // 各テスト前にLocalStorageをクリア
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('初期値を正しく設定する', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe('initialValue');
  });

  it('値を更新する', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    
    act(() => {
      result.current[1]('newValue');
    });
    
    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('関数を使用して値を更新する', () => {
    const { result } = renderHook(() => useLocalStorage<number>('testKey', 0));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify(1));
  });

  it('LocalStorageに既存の値がある場合はそれを使用する', () => {
    window.localStorage.setItem('testKey', JSON.stringify('existingValue'));
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe('existingValue');
  });

  it('LocalStorageから無効なJSONを読み込んだ場合は初期値を使用する', () => {
    // 無効なJSONを設定
    window.localStorage.setItem('testKey', 'invalid-json');
    
    // コンソール警告をモック
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    
    expect(result.current[0]).toBe('initialValue');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('複雑なオブジェクトを保存して取得できる', () => {
    const complexObject = {
      name: 'Test',
      items: [1, 2, 3],
      nested: {
        value: true
      }
    };
    
    const { result } = renderHook(() => useLocalStorage('testKey', complexObject));
    
    act(() => {
      result.current[1]({
        ...complexObject,
        name: 'Updated'
      });
    });
    
    expect(result.current[0]).toEqual({
      ...complexObject,
      name: 'Updated'
    });
    
    expect(JSON.parse(window.localStorage.getItem('testKey') || '')).toEqual({
      ...complexObject,
      name: 'Updated'
    });
  });
});