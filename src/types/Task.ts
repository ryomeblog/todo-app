/**
 * タスクを表すインターフェース
 */
export interface Task {
  /**
   * タスクの一意のID
   */
  id: string;
  
  /**
   * タスクのテキスト内容
   */
  text: string;
  
  /**
   * タスクが完了しているかどうか
   */
  completed: boolean;
  
  /**
   * タスクの作成日時
   */
  createdAt: Date;
}