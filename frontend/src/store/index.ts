import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import postReducer from "./slices/post";
import reviewReducer from "./slices/review";

export const store = configureStore({
	reducer: {
		user: userReducer,
		post: postReducer,
		review: reviewReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
