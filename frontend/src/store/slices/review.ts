import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'

export interface reviewType {
	id: number
	author_id: number
	author_name: string
	title: string
	content: string
	animal_type: string
	photo_path: string[]
	species: string
	created_at: string
}

export interface reviewState {
	reviews: reviewType[]
	selectedReview: reviewType | null
}

const initialState: reviewState = {
	reviews: [],
	selectedReview: null
}

export const getReviews = createAsyncThunk('review/getReviews', async () => {
	const response = await axios.get<reviewType[]>('/api/reviews/')
	return response.data
})

export const getReview = createAsyncThunk(
	'review/getReview',
	async (id: reviewType['id'], { dispatch }) => {
		const response = await axios.get(`/api/reviews/${id}/`)
		return response.data ?? null
	}
)

export const createReview = createAsyncThunk(
	'review/createReview',
	async (review: FormData, { dispatch }) => {
		// const signin = await axios.post('/api/signin/')
		// console.log(signin.data)
		// console.log('CREATE REVIEW')
		const response = await axios.post('/api/reviews/', review)
		dispatch(reviewActions.addReview(response.data))
		return response.data
	}
)

export const deleteReview = createAsyncThunk(
	'review/deleteReview',
	async (id: reviewType['id'], { dispatch }) => {
		await axios.delete(`/api/reviews/${id}/`)
		dispatch(reviewActions.deleteReview({ targetId: id }))
	}
)

export const editReview = createAsyncThunk(
	'review/editReview',
	async (review: reviewType, { dispatch }) => {
		const response = await axios.put(`/api/reviews/${review.id}/`, review)
		dispatch(
			reviewActions.editReview({
				targetId: review.id,
				title: review.title,
				content: review.content,
				animal_type: review.animal_type,
				species: review.species,
				photo_path: review.photo_path
			})
		)
		return response.data
	}
)

export const reviewSlice = createSlice({
	name: 'review',
	initialState,
	reducers: {
		editReview: (
			state,
			action: PayloadAction<{
				targetId: number
				title: string
				content: string
				animal_type: string
				species: string
				photo_path: string[]
			}>
		) => {
			const review = state.reviews.find(
				(value: reviewType) => value.id === action.payload.targetId
			)
			if (review != null) {
				review.title = action.payload.title
				review.content = action.payload.content
				review.animal_type = action.payload.animal_type
				review.species = action.payload.species
				review.photo_path = action.payload.photo_path
			}
		},
		deleteReview: (state, action: PayloadAction<{ targetId: number }>) => {
			const deleted = state.reviews.filter((review: reviewType) => {
				return review.id !== action.payload.targetId
			})
			state.reviews = deleted
		},
		addReview: (
			state,
			action: PayloadAction<{
				id: number
				author_id: number
				author_name: string
				title: string
				content: string
				animal_type: string
				species: string
				photo_path: string[]
			}>
		) => {
			const newReview = {
				id: action.payload.id,
				author_id: action.payload.author_id,
				author_name: action.payload.author_name,
				title: action.payload.title,
				content: action.payload.content,
				animal_type: action.payload.animal_type,
				species: action.payload.species,
				photo_path: action.payload.photo_path,
				created_at: ''
			}
			state.reviews.push(newReview)
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getReviews.fulfilled, (state, action) => {
			state.reviews = action.payload
		})
		builder.addCase(getReview.fulfilled, (state, action) => {
			state.selectedReview = action.payload
		})
		builder.addCase(createReview.rejected, (_state, action) => {
			console.error(action.error)
		})
	}
})

export const reviewActions = reviewSlice.actions
export const selectReview = (state: RootState) => state.review

export default reviewSlice.reducer
