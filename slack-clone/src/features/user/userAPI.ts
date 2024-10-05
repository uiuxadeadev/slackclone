import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebaseConfig';
import { User, UserRef } from '../../types/User';

const db = getFirestore(firebaseApp); // Firestoreデータベースインスタンスを取得

// 指定されたユーザーUIDに基づいてユーザー情報を取得する非同期関数
export const getUser = async (user_uid: string) => {
  const user = doc(db, 'users', user_uid); // 指定されたユーザーUIDのドキュメントを参照
  const docSnap = await getDoc(user); // ドキュメントを取得
  if (docSnap.exists()) {
    // ドキュメントが存在する場合
    return docSnap.data() as User; // ユーザー情報をUser型として返す
  }
};

// 新しいユーザーをデータベースに追加または更新する非同期関数
export const postUser = async (userRef: UserRef) => {
  const user = userRef.user; // ユーザー情報を取得
  // Firestoreにユーザー情報をセット
  await setDoc(doc(db, 'users', userRef.uid), {
    displayName: user.displayName,
    email: user.email,
    profile_picture: user.profile_picture,
  });
};
