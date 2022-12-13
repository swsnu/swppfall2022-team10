import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'
import { postListType } from './post'
import { reviewListType, reviewType } from './review'
import { QnaType } from './qna'

export interface mypostState {
	posts: postListType[]
	likes: postListType[]
	applys: postListType[]
	reviews: reviewListType[]
	qnas: QnaType[]
}

const initialState: mypostState = {
	posts: [],
	likes: [],
	applys: [],
	reviews: [],
	qnas: []
}

export const deleteQna = createAsyncThunk(
	'mypost/deleteQna',
	async (id: QnaType['id'], { dispatch }) => {
		await axios.delete(`/api/questions/${id}/`)
		dispatch(mypostActions.deleteQna({ targetId: id }))
	}
)
export const deleteReview = createAsyncThunk(
	'mypost/deleteReview',
	async (id: reviewType['id'], { dispatch }) => {
		await axios.delete(`/api/reviews/${id}/`)
		dispatch(mypostActions.deleteReview({ targetId: id }))
	}
)

export const getMyPosts = createAsyncThunk('mypost/getMyPosts', async () => {
	const response = await axios.get('/api/users/post')
	return response.data
})

export const mypostSlice = createSlice({
	name: 'mypost',
	initialState,
	reducers: {
		deleteQna: (state, action: PayloadAction<{ targetId: number }>) => {
			const deleted = state.qnas.filter((qna: QnaType) => {
				return qna.id !== action.payload.targetId
			})
			console.log(deleted)
			state.qnas = deleted
		},
		deleteReview: (state, action: PayloadAction<{ targetId: number }>) => {
			const deleted = state.reviews.filter((review: reviewListType) => {
				return review.id !== action.payload.targetId
			})
			console.log(deleted)
			state.reviews = deleted
		}
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getMyPosts.fulfilled, (state, action) => {
			state.posts = action.payload[0]
			state.likes = action.payload[1]
			state.applys = action.payload[2]
			state.reviews = action.payload[3]
			state.qnas = action.payload[4]
		})
	}
})

export const mypostActions = mypostSlice.actions
export const selectMyPost = (state: RootState) => state.mypost

export default mypostSlice.reducer
