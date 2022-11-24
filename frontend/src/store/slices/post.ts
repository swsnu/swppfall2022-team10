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
	photo_path: string[]
	species: string
	age: number
	gender: boolean
	content: string
	created_at: string
	is_active: boolean
	editable: boolean
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
	is_active: boolean
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

export interface postState {
	posts: postType[]
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
		// async (pgid: number, { dispatch }) => {
		// let queryString = `?page=${data.page_number}`
		//
		// if (data.animal_type !== '')
		// 	queryString = queryString.concat(
		// 		`/?animal_type=${data.animal_type}`
		// 	)
		// if (data.species !== '')
		// 	queryString = queryString.concat(`/?species=${data.species}`)
		// if (data.gender !== null)
		// 	queryString = data.gender
		// 		? queryString.concat(`/?gender=True`)
		// 		: queryString.concat(`/?gender=False`)
		// if (data.is_active) queryString = queryString.concat(`/?is_active=True`)
		// if (data.age !== null) {
		// 	if (data.age.length === 1)
		// 		queryString = queryString.concat(`/?age=${String(data.age[0])}`)
		// 	else if (data.age[0] === null)
		// 		queryString = queryString.concat(
		// 			`/?age_max=${String(data.age[1])}`
		// 		)
		// 	else if (data.age[1] === null)
		// 		queryString = queryString.concat(
		// 			`/?age_min=${String(data.age[0])}`
		// 		)
		// 	else
		// 		queryString = queryString.concat(
		// 			`/?age_min=${String(data.age[0])}/?age_max=${String(
		// 				data.age[1]
		// 			)}`
		// 		)
		// }
		// if (data.date !== null) {
		// 	if (data.date.length === 1)
		// 		queryString = queryString.concat(
		// 			`/?date=${String(data.date[0])}`
		// 		)
		// 	else if (data.date[0] === null)
		// 		queryString = queryString.concat(
		// 			`/?date_max=${String(data.date[1])}`
		// 		)
		// 	else if (data.date[1] === null)
		// 		queryString = queryString.concat(
		// 			`/?date_min=${String(data.date[0])}`
		// 		)
		// 	else
		// 		queryString = queryString.concat(
		// 			`/?date_min=${String(data.date[0])}/?date_max=${String(
		// 				data.date[1]
		// 			)}`
		// 		)
		// }
		// console.log(queryString)

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
		return response.data ?? null
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
	async (post: postType, { dispatch }) => {
		const response = await axios.put(`/api/posts/${post.id}/`, post)
		// dispatch(
		// 	postActions.editPost({
		// 		targetId: post.id,
		// 		title: post.title,
		// 		name: post.name,
		// 		vaccination: post.vaccination,
		// 		neutering: post.neutering,
		// 		animal_type: post.animal_type,
		// 		species: post.species,
		// 		photo_path: post.photo_path,
		// 		age: post.age,
		// 		gender: post.gender,
		// 		content: post.content
		// 	})
		// )
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
		// editPost: (
		// 	state,
		// 	action: PayloadAction<{
		// 		targetId: number
		// 		name: string
		// 		vaccination: boolean
		// 		neutering: boolean
		// 		title: string
		// 		animal_type: string
		// 		species: string
		// 		photo_path: string[]
		// 		age: number
		// 		gender: boolean
		// 		content: string
		// 	}>
		// ) => {
		// 	const post = state.posts.find(
		// 		(value: postType) => value.id === action.payload.targetId
		// 	)
		// 	if (post != null) {
		// 		post.name = action.payload.name
		// 		post.vaccination = action.payload.vaccination
		// 		post.neutering = action.payload.neutering
		// 		post.title = action.payload.title
		// 		post.animal_type = action.payload.animal_type
		// 		post.species = action.payload.species
		// 		post.photo_path = action.payload.photo_path
		// 		post.age = action.payload.age
		// 		post.gender = action.payload.gender
		// 		post.content = action.payload.content
		// 	}
		// },
		// deletePost: (state, action: PayloadAction<{ targetId: number }>) => {
		// 	const deleted = state.posts.filter((post: postType) => {
		// 		return post.id !== action.payload.targetId
		// 	})
		// 	state.posts = deleted
		// },
		// addPost: (
		// 	state,
		// 	action: PayloadAction<{
		// 		id: number
		// 		author_id: number
		// 		author_name: string
		// 		title: string
		// 		name: string
		// 		vaccination: boolean
		// 		neutering: boolean
		// 		animal_type: string
		// 		species: string
		// 		photo_path: string[]
		// 		age: number
		// 		gender: boolean
		// 		content: string
		// 	}>
		// ) => {
		// 	const newPost = {
		// 		id: action.payload.id,
		// 		author_id: action.payload.author_id,
		// 		author_name: action.payload.author_name,
		// 		name: action.payload.name,
		// 		vaccination: action.payload.vaccination,
		// 		neutering: action.payload.neutering,
		// 		title: action.payload.title,
		// 		animal_type: action.payload.animal_type,
		// 		species: action.payload.species,
		// 		photo_path: action.payload.photo_path,
		// 		age: action.payload.age,
		// 		gender: action.payload.gender,
		// 		content: action.payload.content,
		// 		created_at: '',
		// 		is_active: true,
		// 	}
		// 	state.posts.push(newPost)
		// }
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getPosts.fulfilled, (state, action) => {
			// Add post to the state array
			state.posts = action.payload.results
		})
		builder.addCase(getPost.fulfilled, (state, action) => {
			state.selectedPost = action.payload
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
