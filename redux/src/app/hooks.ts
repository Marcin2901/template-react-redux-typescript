import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`

// tworzymy własny chook żeby zaznaczyć że use Dispatch wymaga argumentu który jest 
// tylko i wyłącznie takiego typu jaki AppDispatch czyli store.dispatch
// mówiąc szczerze to mówimy że dispatch to dispatch tylko musimy pokazać co to my nie potrafimy
export const useAppDispatch = () => useDispatch<AppDispatch>();

// nie wiem co to ten TypedUseSelectorHook ale wiem że nasz useAppSelector jest jego typu
// a generalnie to useAppSelector jest równy useSelector czyli znowu idziemy na około
// podobno chodzi o to że useAppSelector nie dostanie całeho RootStata tylko np. RootState.users
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
