import { getFirestore, query, collection, where, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebaseConfig';
import { Message, MessageRef } from '../../types/Message';

// Firestoreデータベースのインスタンスを取得
const db = getFirestore(firebaseApp);

/**
 * チャンネルIDに基づいてメッセージのサブスクリプションを行い、リアルタイムにメッセージを取得する関数
 * @param channelID チャンネルのID
 * @param onMessagesUpdated メッセージが更新されたときに呼び出されるコールバック関数
 * @returns Firestoreのサブスクリプション（クリーンアップ時に呼び出すための関数）
 */
export const subscribeMessages = (channelID: string, onMessagesUpdated: (messages: MessageRef[]) => void) => {
  // 特定のチャンネルIDのメッセージを取得するクエリを作成
  const q = query(collection(db, 'messages'), where('channel_id', '==', channelID));

  // メッセージをリアルタイムで取得するためにonSnapshotを使う
  return onSnapshot(
    q,
    (querySnapshot) => {
      const messageRefs: MessageRef[] = [];
      // クエリスナップショット内の各ドキュメントを処理
      querySnapshot.forEach((doc) => {
        messageRefs.push({
          id: doc.id, // ドキュメントID
          message: doc.data() as Message, // ドキュメントデータをMessage型にキャスト
        });
      });
      // 取得したメッセージリストをコールバック関数で処理
      onMessagesUpdated(messageRefs);
    },
    (error) => {
      // エラーハンドリング
      console.error('Failed to subscribe messages:', error);
    }
  );
};

/**
 * 新しいメッセージをFirestoreに投稿する関数
 * @param message 送信するメッセージオブジェクト
 */
export const postMessage = async (message: Message) => {
  // Firestoreのmessagesコレクションに新しいドキュメントとしてメッセージを追加
  await addDoc(collection(db, 'messages'), message);
};

/**
 * メッセージオブジェクトを生成するヘルパー関数
 * @param userId ユーザーID
 * @param channelId チャンネルID
 * @param messageText メッセージ本文
 * @returns 作成されたメッセージオブジェクト
 */
export const createMessage = (userId: string, channelId: string, messageText: string): Message => {
  const timestamp = Timestamp.fromDate(new Date()); // 現在の日時をFirestoreのタイムスタンプとして取得
  return {
    user_id: userId, // メッセージを送信したユーザーのID
    channel_id: channelId, // メッセージが投稿されたチャンネルのID
    text: messageText, // メッセージの内容
    create_at: timestamp, // 作成日時
    is_edited: false, // メッセージが編集されたかどうか（初期値はfalse）
    update_at: timestamp, // 更新日時（作成時は作成日時と同じ）
  };
};
