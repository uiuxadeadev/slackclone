import { createSlice } from '@reduxjs/toolkit';
import { signInWithGoogle } from '../auth/Auth';
import { getUser, postUser } from './userAPI';
import { User } from '../../types/User';

const initialState = {
  userId: '',
};

// Googleサインインとユーザー設定を行う非同期関数
export const googleSignInAndUserSetup = async () => {
  try {
    const result = await signInWithGoogle(); // Googleサインインを実行
    const login_user = result.user; // ログインしたユーザー情報を取得
    const user = await getUser(login_user.uid); // ユーザー情報を取得

    if (!user) {
      // ユーザーが存在しない場合
      const newUser: User = {
        // 新しいユーザーオブジェクトを作成
        profile_picture: login_user.photoURL ?? '', // プロフィール画像
        email: login_user.email ?? '', // メールアドレス
        displayName: login_user.displayName ?? '', // 表示名
      };
      // Firestoreに新しいユーザーを追加
      await postUser({
        uid: login_user.uid, // UID
        user: newUser, // 新しいユーザー情報
      });
    }
    return login_user.uid; // UIDを返す
  } catch (error) {
    console.error('Login failed:', error); // エラーが発生した場合、エラーログを出力
  }
};

// userSliceを作成
export const userSlice = createSlice({
  name: 'userId', // スライスの名前
  initialState, // 初期状態を指定
  reducers: {
    login: (state, action) => {
      state.userId = action.payload; // アクションから受け取った値でuserIdを更新
    },
    logout: (state) => {
      state.userId = ''; // ログアウト時にuserIdを空にする
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
