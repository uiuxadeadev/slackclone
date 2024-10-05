import React, { useEffect, useState } from 'react';
import { User } from '../../types/User';
import { Message } from '../../types/Message';
import { getUser } from '../../features/user/userAPI';

// MessageTile コンポーネントのプロパティ型を定義
interface MessageTileProps {
  message: Message; // メッセージオブジェクトを受け取る
}

// MessageTile コンポーネントを定義
const MessageTile = (message: MessageTileProps) => {
  // メッセージの送信者情報を保持する状態
  const [owner, setUser] = useState<User | null>(null);

  // コンポーネントがマウントされたときに実行される副作用
  useEffect(() => {
    // ユーザー情報を非同期に取得する関数
    const fetchUser = async () => {
      try {
        // メッセージのユーザー ID を使ってユーザー情報を取得
        const ownerData = await getUser(message.message.user_id);
        if (ownerData) {
          setUser(ownerData); // ユーザー情報が存在すれば状態を更新
        }
      } catch (error) {
        setUser(null); // エラーが発生した場合、ユーザー情報を null に設定
      }
    };
    fetchUser(); // ユーザー情報を取得する関数を呼び出す
  }, []); // 依存配列が空なので、コンポーネントの初回マウント時のみ実行される

  return (
    <div className="bg-gray-700 p-3 m-3 rounded-lg">
      {/* メッセージの外観を定義するコンテナ */}
      <div className="flex items-center mb-2">
        <img
          src={owner?.profile_picture || './default-user-icon.webp'}
          // ユーザーのプロフィール画像を表示、存在しない場合はデフォルト画像を使用
          alt="プロフィール画像"
          className="w-10 h-10 rounded-full mr-2"
          // 画像のスタイルを定義 (丸型、サイズなど)
        />
        <div>
          <div className="text-sm font-semibold">{owner?.displayName || 'unknown'}</div>
          {/* ユーザーの表示名を表示、存在しない場合は 'unknown' と表示 */}
          <div className="text-xs text-gray-400">{message.message.create_at.toDate().toLocaleString() || ''}</div>
          {/* メッセージ作成日時を表示、日付オブジェクトをローカル文字列に変換 */}
        </div>
      </div>
      <p className="text-gray-300">{message.message.text}</p>
    </div>
  );
};

export default MessageTile;
