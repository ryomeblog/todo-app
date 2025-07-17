import React from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * useLocalStorageフックの使用例を示すコンポーネント
 */
export const LocalStorageExample: React.FC = () => {
  // 文字列型の値をLocalStorageに保存
  const [name, setName] = useLocalStorage<string>('name', '');
  
  // 数値型の値をLocalStorageに保存
  const [count, setCount] = useLocalStorage<number>('count', 0);
  
  // オブジェクト型の値をLocalStorageに保存
  const [settings, setSettings] = useLocalStorage<{ theme: string; notifications: boolean }>(
    'settings',
    { theme: 'light', notifications: true }
  );

  return (
    <div>
      <h2>LocalStorage Example</h2>
      
      <div>
        <h3>Name</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <p>Stored name: {name || '(empty)'}</p>
      </div>
      
      <div>
        <h3>Counter</h3>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <p>Count: {count}</p>
      </div>
      
      <div>
        <h3>Settings</h3>
        <div>
          <label>
            Theme:
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Notifications:
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
          </label>
        </div>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
      
      <div>
        <h3>Reset All</h3>
        <button
          onClick={() => {
            setName('');
            setCount(0);
            setSettings({ theme: 'light', notifications: true });
          }}
        >
          Reset All Values
        </button>
      </div>
    </div>
  );
};