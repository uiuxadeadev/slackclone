import { getFirestore, query, collection, onSnapshot, Timestamp, addDoc } from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebaseConfig';
import { Channel, ChannelRef } from '../../types/Channel';

const db = getFirestore(firebaseApp);

/**
 * チャンネルのリストをリアルタイムでサブスクライブし、更新されたデータを取得する関数
 * @param onChannelsUpdated - チャンネルの更新時に呼び出されるコールバック関数
 * @returns サブスクリプションの解除関数
 */
export const subscribeChannels = (onChannelsUpdated: (channels: ChannelRef[]) => void) => {
  // チャンネルのコレクションを取得するクエリを作成
  const q = query(collection(db, 'channels'));

  // リアルタイムで Firestore データを監視する onSnapshot 関数を使用
  return onSnapshot(
    q,
    (querySnapshot) => {
      const channelRefs: ChannelRef[] = [];
      // 取得したスナップショット内の各ドキュメントを処理
      querySnapshot.forEach((doc) => {
        channelRefs.push({
          id: doc.id, // ドキュメント ID
          channel: doc.data() as Channel, // ドキュメントデータを Channel 型にキャスト
        });
      });
      // コールバック関数を呼び出して、更新されたチャンネルリストを提供
      onChannelsUpdated(channelRefs);
    },
    (error) => {
      // サブスクリプションが失敗した場合のエラーハンドリング
      console.error('Failed to subscribe channels:', error);
    }
  );
};

/**
 * 新しいチャンネルを Firestore に追加する関数
 * @param channel - 追加するチャンネルオブジェクト
 */
export const postChannel = async (channel: Channel) => {
  // Firestore の channels コレクションにドキュメントとしてチャンネルを追加
  await addDoc(collection(db, 'channels'), channel);
};

/**
 * 新しいチャンネルオブジェクトを作成するヘルパー関数
 * @param name - チャンネルの名前
 * @returns 作成されたチャンネルオブジェクト
 */
export const createChannel = (name: string): Channel => {
  const timestamp = Timestamp.fromDate(new Date()); // 現在の日時を Firestore のタイムスタンプとして取得
  return {
    name: name, // チャンネル名
    create_at: timestamp, // 作成日時
  };
};
