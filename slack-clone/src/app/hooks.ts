// react-redux から useDispatch と useSelector フックをインポート
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// store.ts から AppDispatch 型と RootState 型をインポート
import { AppDispatch, RootState } from './store';

// useDispatch フックを型付きで使うためのカスタムフックを定義
// AppDispatch 型を返すことで、Redux に対する型安全なディスパッチを提供
export const useAppDispatch: () => AppDispatch = useDispatch;

// useSelector フックを型付きで使うためのカスタムフックを定義
// RootState を型として使用することで、store の状態を型安全に参照可能
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
