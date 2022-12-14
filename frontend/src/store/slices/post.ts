import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'

export interface postType {
	id: number
	author_id: number
	author_name: string
	name: string
	vaccination: boolean
	neutering: boolean
	title: string
	animal_type: string
	photo_path: Array<{ id: number; photo_path: string }>
	species: string
	age: number
	gender: boolean
	content: string
	created_at: string
	is_active: boolean
	form: string
}

export interface postListType {
	id: number
	author_name: string
	title: string
	animal_type: string
	thumbnail: string
	species: string
	age: number
	gender: boolean
}

export interface postFilterType {
	page: number
	animal_type: string | null
	date: number | null
	date_min: number | null
	date_max: number | null
	age: number | null
	age_min: number | null
	age_max: number | null
	species: string | null
	is_active: boolean | null
}

export interface postCreateType {
	author_id: number
	title: string
	name: string
	animal_type: string
	species: string
	age: number
	gender: boolean
	vaccination: boolean
	neutering: boolean
	content: string
}

export interface deleteImageType {
	id: number
	photo_id: number
}

export interface postState {
	posts: postListType[]
	selectedPost: postType | null
	selectedAnimal: string
}

const initialState: postState = {
	posts: [],
	selectedPost: null,
	selectedAnimal: ''
}

export const selectAnimal = createAsyncThunk(
	'post/selectAnimal',
	async (animalType: string, { dispatch }) => {
		dispatch(postActions.selectAnimal({ animal_type: animalType }))
	}
)

export const getPosts = createAsyncThunk(
	'post/getPosts',
	async (data: postFilterType, { dispatch }) => {
		const response = await axios.get(`/api/posts/`, {
			params: data
		})
		return response.data
	}
)

export const getPost = createAsyncThunk(
	'post/getPost',
	async (id: postType['id'], { dispatch }) => {
		const response = await axios.get(`/api/posts/${id}/`)
		return response.data
	}
)

export const createPost = createAsyncThunk(
	'post/createPost',
	async (post: FormData, { dispatch }) => {
		const response = await axios.post('/api/posts/', post)
		// dispatch(postActions.addPost(response.data))
		return response.data
	}
)

export const deletePost = createAsyncThunk(
	'post/deletePost',
	async (id: postType['id'], { dispatch }) => {
		await axios.delete(`/api/posts/${id}/`)
		// dispatch(postActions.deletePost({ targetId: id }))
	}
)

export const editPost = createAsyncThunk(
	'post/editPost',
	async (data: { id: string; post: FormData }, { dispatch }) => {
		const response = await axios.put(`/api/posts/${data.id}/`, data.post)
		return response.data
	}
)

export const checkPost = createAsyncThunk('post/checkPost', async () => {
	const response = await axios.get<postListType[]>('/api/reviews/check/')
	return response.data
})

export const bookmarkPost = createAsyncThunk(
	'post/bookmarkPost',
	async (postId: postType['id'], { dispatch }) => {
		const response = await axios.put(`/api/posts/${postId}/bookmark/`)
		return response.data
	}
)

export const deletePostImage = createAsyncThunk(
	'post/deletePostImage',
	async (data: deleteImageType, { dispatch }) => {
		const response = await axios.delete(
			`/api/posts/${data.id}/photos/${data.photo_id}`
		)
		return response.data
	}
)

export const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		selectAnimal: (
			state,
			action: PayloadAction<{
				animal_type: string
			}>
		) => {
			state.selectedAnimal = action.payload.animal_type
		}
		// deletePost: (state, action: PayloadAction<{ targetId: number }>) => {
		// 	const deleted = state.posts.filter((post: postType) => {
		// 		return post.id !== action.payload.targetId
		// 	})
		// 	state.posts = deleted
		// },
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getPosts.fulfilled, (state, action) => {
			// Add post to the state array
			state.posts = action.payload.results
		})
		builder.addCase(checkPost.fulfilled, (state, action) => {
			state.posts = action.payload
		})
		builder.addCase(getPost.fulfilled, (state, action) => {
			state.selectedPost = action.payload.post
		})
		builder.addCase(getPost.rejected, (state, action) => {
			state.selectedPost = null
		})
		builder.addCase(createPost.rejected, (_state, action) => {
			// console.error(action.error)
			alert('ERROR')
		})
	}
})

export const postActions = postSlice.actions
export const selectPost = (state: RootState) => state.post

export default postSlice.reducer
