import {combineReducers, configureStore} from '@reduxjs/toolkit';
import RxThunk from 'redux-thunk';
import {ITodosState, todosReducer} from './todosReducer';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

export type IRootState = {
  todoState: ITodosState;
};

const rootReducer = combineReducers<IRootState>({
  todoState: todosReducer.reducer,
  // define here more reducers
});
const persistRootReduce = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['todoState'],
  },
  rootReducer,
);

const store = configureStore({
  reducer: persistRootReduce,
  middleware: [RxThunk],
});
export const persistor = persistStore(store);
export default store;
