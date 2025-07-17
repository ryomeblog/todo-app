# useLocalStorage カスタムフック

このカスタムフックは、Reactコンポーネントの状態をブラウザのLocalStorageに永続化するためのものです。useState と同様のAPIを提供しながら、自動的にLocalStorageへの保存と読み込みを行います。

## 機能

- LocalStorageへの値の保存と取得
- 型安全性（TypeScriptジェネリクスを使用）
- エラーハンドリング
- 他のタブでの変更の検知と同期
- 関数型の更新をサポート（`setValue(prev => prev + 1)` のような使い方）

## 使い方

```tsx
import { useLocalStorage } from './hooks/useLocalStorage';

function MyComponent() {
  // 基本的な使い方（文字列）
  const [name, setName] = useLocalStorage<string>('name', '');
  
  // 数値の保存
  const [count, setCount] = useLocalStorage<number>('count', 0);
  
  // オブジェクトの保存
  const [user, setUser] = useLocalStorage<{ id: number; name: string }>(
    'user',
    { id: 1, name: 'Guest' }
  );
  
  // 配列の保存
  const [items, setItems] = useLocalStorage<string[]>('items', []);
  
  // 関数型の更新
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  // オブジェクトの一部を更新
  const updateUserName = (newName: string) => {
    setUser(prevUser => ({ ...prevUser, name: newName }));
  };
  
  // 配列に要素を追加
  const addItem = (item: string) => {
    setItems(prevItems => [...prevItems, item]);
  };
  
  return (
    // コンポーネントのUI
  );
}
```

## 注意点

1. **シリアライズ可能なデータのみ保存可能**：
   LocalStorageはJSON形式でデータを保存するため、関数、Symbol、循環参照を含むオブジェクトなどは保存できません。

2. **容量制限**：
   LocalStorageには約5MBの容量制限があります。大量のデータを保存する場合は注意してください。

3. **プライバシーモード**：
   ブラウザのプライバシーモードではLocalStorageが制限される場合があります。

4. **サーバーサイドレンダリング**：
   このフックはブラウザ環境でのみ動作します。SSRを使用する場合は、window オブジェクトの存在チェックが必要です（このフックには組み込まれています）。

## エラーハンドリング

このフックは以下のエラーを自動的に処理します：

- LocalStorageへのアクセスエラー
- JSONパースエラー
- JSONシリアライズエラー

エラーが発生した場合、コンソールに警告が表示され、初期値が使用されます。