import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import SendIcon from '@mui/icons-material/Send';
import { MessageRef } from '../../types/Message';
import { useAppSelector } from '../../app/hooks';
import { createMessage, subscribeMessages, postMessage } from '../../features/message/messageAPI';
import MessageTile from './MessageTile';

const MessageArea = () => {
  // メッセージの参照（配列）を状態として管理する
  const [messageRefs, setMessageRefs] = useState<MessageRef[]>([]);
  // Redux ストアから userId を取得
  const userId = useAppSelector((state) => state.user.userId);
  // Redux ストアから現在のチャンネル ID を取得
  const channelId: string = useAppSelector((state) => state.channel.currentChannelId);

  // 現在入力中のメッセージを保持する状態
  const [message, setMessage] = useState('');

  // テキストエリアの変更を処理する関数
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value); // メッセージの内容を更新
  };

  // メッセージを送信する関数
  const sendMessage = async () => {
    if (userId) {
      // ユーザーが存在する場合のみ送信処理を行う
      try {
        // メッセージを作成し、サーバーに送信
        await postMessage(createMessage(userId, channelId, message));
        setMessage(''); // メッセージを送信後に入力フィールドをクリア
      } catch (e) {
        console.error('Error sending message: ', e); // 送信エラーが発生した場合はログに表示
      }
    }
  };

  // キーボードイベントを処理する関数
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter もしくは Cmd+Enter でメッセージを送信する
    if ((e.metaKey || e.ctrlKey) && e.code === 'Enter') {
      sendMessage(); // メッセージを送信
    }
  };

  // チャンネルのメッセージを購読してリアルタイムで取得するための副作用
  useEffect(() => {
    // メッセージの購読を開始
    const unsubscripbe = subscribeMessages(channelId, (messageRefs) => {
      setMessageRefs(messageRefs); // メッセージが更新されたら状態を更新
    });
    // クリーンアップ関数 (コンポーネントがアンマウントされた際に購読を解除)
    return () => unsubscripbe();
  }, [channelId]); // チャンネル ID が変更されるたびに購読をリセット

  return (
    // メッセージエリア全体を定義
    <div className="flex-1 flex flex-col bg-gray-500 text-white">
      {/* メッセージ一覧を表示する領域 */}
      <div className="p-4 m-3 overflow-y-auto">
        {/* メッセージのリストを map で描画 */}
        {messageRefs.map((messageRef) => (
          <MessageTile message={messageRef.message} key={messageRef.id} />
        ))}
      </div>

      {/* メッセージ入力エリア */}
      <div className="mt-auto px-4 py-2 bottom-0 bg-gray-900">
        <div className="flex items-center">
          {/* メッセージ入力用テキストエリア (サイズ自動調整) */}
          <TextareaAutosize
            placeholder="Input message" // プレースホルダー
            className="flex-1 bg-gray-700 text-white p-2 mx-2 rounded-lg focus:outline-none"
            onChange={handleInputChange} // メッセージ入力時に handleInputChange を呼び出す
            onKeyDown={handleKeyDown} // キー押下時に handleKeyDown を呼び出す (Ctrl+Enter で送信)
            value={message} // テキストエリアの内容は message 状態にバインド
          />
          {/* 送信ボタン (SendIcon を表示) */}
          <button className="text-gray-400 hover:text-white" onClick={sendMessage}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;
