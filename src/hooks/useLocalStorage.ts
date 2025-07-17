import { useState, useEffect } from 'react';

/**
 * LocalStorageを使用してデータを永続化するカスタムフック
 * 
 * @param key - LocalStorageに保存するキー
 * @param initialValue - 初期値
 * @returns [storedValue, setValue] - 保存された値と値を更新する関数
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 初期値の取得ロジック
  const readValue = (): T => {
    // ブラウザ環境かどうかをチェック
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // LocalStorageからデータを取得
      const item = window.localStorage.getItem(key);
      
      // データが存在する場合はパース、存在しない場合は初期値を返す
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`LocalStorage "${key}"の読み込み中にエラーが発生しました:`, error);
      return initialValue;
    }
  };

  // 状態の初期化
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 値を更新する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 値が関数の場合は関数を実行して新しい値を取得
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Reactの状態を更新
      setStoredValue(valueToStore);
      
      // ブラウザ環境かどうかをチェック
      if (typeof window !== 'undefined') {
        // LocalStorageに保存
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`LocalStorage "${key}"への保存中にエラーが発生しました:`, error);
    }
  };

  // キーが変更された場合に値を再読み込み
  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  // ウィンドウのストレージイベントをリッスン（他のタブでの変更を検知）
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.warn(`LocalStorage "${key}"の同期中にエラーが発生しました:`, error);
        }
      }
    };

    // イベントリスナーを追加
    window.addEventListener('storage', handleStorageChange);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}