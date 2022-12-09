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
	post_id: number
}

export interface reviewListType {
	id: number
	author_id: number
	author_name: string
	title: string
	animal_type: string
	thumbnail: string
	species: string
	created_at: string
	post_id: number
}

export interface reviewFilterType {
	page: number
	animal_type: string | null
}

export interface reviewState {
	reviews: reviewListType[]
	selectedReview: reviewType | null
	selectedAnimal: string
}

const initialState: reviewState = {
	reviews: [],
	selectedReview: null,
	selectedAnimal: ''
}

export const selectAnimal = createAsyncThunk(
	'review/selectAnimal',
	async (animalType: string, { dispatch }) => {
		dispatch(reviewActions.selectAnimal({ animal_type: animalType }))
	}
)

export const getReviews = createAsyncThunk(
	'review/getReviews',
	async (data: reviewFilterType, { dispatch }) => {
		const response = await axios.get('/api/reviews/', {
			params: data
		})
		return response.data
	}
)

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
		// dispatch(reviewActions.addReview(response.data))
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

export const reviewSlice = createSlice({
	name: 'review',
	initialState,
	reducers: {
		selectAnimal: (
			state,
			action: PayloadAction<{
				animal_type: string
			}>
		) => {
			state.selectedAnimal = action.payload.animal_type
		},
		deleteReview: (state, action: PayloadAction<{ targetId: number }>) => {
			const deleted = state.reviews.filter((review: reviewListType) => {
				return review.id !== action.payload.targetId
			})
			state.reviews = deleted
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getReviews.fulfilled, (state, action) => {
			state.reviews = action.payload.results
		})
		builder.addCase(getReview.fulfilled, (state, action) => {
			state.selectedReview = action.payload
		})
		builder.addCase(createReview.rejected, (_state, action) => {
			alert('ERROR')
		})
	}
})

export const reviewActions = reviewSlice.actions
export const selectReview = (state: RootState) => state.review

export default reviewSlice.reducer
