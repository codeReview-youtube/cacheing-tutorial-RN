import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};
export type ITodosState = {
  todos: Array<Todo>;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
};
const initialState: ITodosState = {
  todos: [],
  status: 'idle',
};

export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = await response.json();
  return json;
});

export const todosReducer = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.status = 'pending';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});
