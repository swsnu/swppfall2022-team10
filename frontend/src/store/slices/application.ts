import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'

export interface applicationType {
	id: number
	author_id: number
	author_name: string
	files: string[]
	created_at: string
	post_id: number
}

export interface applicationState {
	applications: applicationType[]
	selectedApplication: applicationType | null
}

const initialState: applicationState = {
	applications: [],
	selectedApplication: null
}

export const getApplications = createAsyncThunk(
	'application/getApplications',
	async (postId: applicationType['post_id'], { dispatch }) => {
		const response = await axios.get<applicationType[]>(
			`/api/apply/${postId}/`
		)
		return response.data ?? null
	}
)

export const createApplication = createAsyncThunk(
	'application/createApplication',
	async (application: FormData, { dispatch }) => {
		const response = await axios.post('/api/apply/', application)
		return response.data
	}
)

export const applicationSlice = createSlice({
	name: 'application',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getApplications.fulfilled, (state, action) => {
			// Add post to the state array
			state.applications = action.payload
		})
		builder.addCase(createApplication.rejected, (_state, action) => {
			alert('ERROR')
		})
	}
})

export const applicationActions = applicationSlice.actions
export const selectApplication = (state: RootState) => state.application

export default applicationSlice.reducer
