import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import postReducer from "./slices/post";
import commentReducer from "./slices/comment";

export const store = configureStore({
	reducer: {
		user: userReducer,
		post: postReducer,
		comment: commentReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
