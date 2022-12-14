import { configureStore } from '@reduxjs/toolkit'
// import userReducer from './slices/user'
import postReducer from './slices/post'
import reviewReducer from './slices/review'
import applicationReducer from './slices/application'
import qnaReducer from './slices/qna'
import mypostReducer from './slices/mypost'
// import commentReducer from './slices/comment'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

export const store = configureStore({
	reducer: {
		// user: userReducer,
		post: postReducer,
		review: reviewReducer,
		application: applicationReducer,
		qna: qnaReducer,
		mypost: mypostReducer
		// comment: commentReducer,
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
