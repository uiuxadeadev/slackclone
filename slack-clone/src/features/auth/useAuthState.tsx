import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './Auth';
import { login, logout } from '../user/userSlice';

const useAuthState = () => {
  const dispatch = useDispatch(); // Redux の dispatch を使用するためのフック

  useEffect(() => {
    // Firebase Auth の認証状態の変更を監視する
    const unsubscribe = auth.onAuthStateChanged((loginUser) => {
      if (loginUser) {
        // ユーザーがログインしている場合、ユーザーIDを Redux ストアに保存
        dispatch(login(loginUser.uid));
      } else {
        // ユーザーがログアウトしている場合、ユーザーIDをストアから削除
        dispatch(logout());
      }
    });

    // コンポーネントのアンマウント時に、イベントリスナーを解除する
    return () => unsubscribe();
  }, [dispatch]);

  return;
};

export default useAuthState;
