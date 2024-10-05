// Redux Toolkit から configureStore 関数をインポート
import { configureStore } from '@reduxjs/toolkit';
// 各スライス (user と channel) のリデューサーをインポート
import userReducer from '../features/user/userSlice';
import channelReducer from '../features/channel/channelSlice';

// Redux ストアを作成
// user と channel のリデューサーを設定して、グローバルな状態管理を行う
export const store = configureStore({
  reducer: {
    user: userReducer, // user に関連する状態管理
    channel: channelReducer, // channel に関連する状態管理
  },
});

// store に設定された dispatch 関数の型を取得し、AppDispatch 型としてエクスポート
export type AppDispatch = typeof store.dispatch;

// store からグローバルな状態 (RootState) の型を取得
// この型は useSelector などで状態を参照する際に使用される
export type RootState = ReturnType<typeof store.getState>;
