import React from 'react';
import { signInWithGoogle } from '../features/auth/Auth';

const Login = () => {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const login_user = result.user;
      console.log(login_user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="fixed flex inset-0 items-center justify-center bg-gray-500">
      <div className="w-full max-w-xs">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-8">
            <h1 className="text-3xl text-center text-gray-700 mt-4">Login to slack</h1>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={loginWithGoogle}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
