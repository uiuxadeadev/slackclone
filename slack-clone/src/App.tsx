import React from 'react';
import SideBar from './components/SideBar';
import ChatContainer from './components/ChatContainer';
import Login from './components/Login';
import { useAppSelector } from './app/hooks';
import useAuthState from './features/auth/useAuthState';

function App() {
  // アプリケーションで自動ログイン機能を有効にする
  useAuthState();

  // ReduxストアからユーザーIDを取得
  const userId = useAppSelector((state) => state.user.userId);

  return (
    <div className="flex">
      {userId ? (
        <>
          <SideBar />
          <ChatContainer />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
