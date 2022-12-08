import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'
import { postListType, postType } from './post'

export interface mypostState {
	posts: postListType[]
	likes: postListType[]
	applys: postListType[]
}

const initialState: mypostState = {
	posts: [],
	likes: [],
	applys: []
}

export const getMyPosts = createAsyncThunk('mypost/getMyPosts', async () => {
	const response = await axios.get('/api/users/post')
	return response.data
})

export const mypostSlice = createSlice({
	name: 'mypost',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getMyPosts.fulfilled, (state, action) => {
			state.posts = action.payload[0]
			state.likes = action.payload[1]
			state.applys = action.payload[2]
		})
	}
})

export const mypostActions = mypostSlice.actions
export const selectMyPost = (state: RootState) => state.mypost

export default mypostSlice.reducer
