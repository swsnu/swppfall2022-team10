import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'

export interface applicationType {
	id: number
	author_id: number
	author_name: string
	file: string
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
	async (postId: string, { dispatch }) => {
		const response = await axios.get<applicationType[]>(
			`/api/posts/${postId}/applications/`
		)
		return response.data ?? null
	}
)

export const getMyApplications = createAsyncThunk(
	'application/getMyApplications',
	async (postId: string, { dispatch }) => {
		const response = await axios.get<applicationType[]>(
			`/api/myposts/${postId}/applications/`
		)
		return response.data ?? null
	}
)

export const getApplication = createAsyncThunk(
	'application/getApplication',
	async (app: applicationType, { dispatch }) => {
		const response = await axios.get<applicationType>(
			`/api/posts/${app.post_id}/applications/${app.id}/`
		)
		return response.data ?? null
	}
)

export const createApplication = createAsyncThunk(
	'application/createApplication',
	async (arg: { application: FormData, postId: string }, { dispatch }) => {
		const response = await axios.post(`/api/posts/${arg.postId}/applications/`, arg.application)
		return response.data
	}
)

export const acceptApplication = createAsyncThunk(
	'application/acceptApplication',
	async (arg: { id: string, postId: string }, { dispatch }) => {
		const response = await axios.post(`/api/posts/${arg.postId}/applications/${arg.id}/accept`)
		return response.data
	}
)

export const deleteApplication = createAsyncThunk(
	'application/deleteApplication',
	async (app: applicationType, { dispatch }) => {
		await axios.delete(`/api/posts/${app.post_id}/applications/${app.id}/`)
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
		builder.addCase(getMyApplications.fulfilled, (state, action) => {
			// Add post to the state array
			state.applications = action.payload
		})
		builder.addCase(getApplication.fulfilled, (state, action) => {
			state.selectedApplication = action.payload
		})
		builder.addCase(createApplication.rejected, (_state, action) => {
			alert('ERROR')
		})
		builder.addCase(acceptApplication.rejected, (_state, action) => {
			alert('ERROR')
		})

	}
})

export const applicationActions = applicationSlice.actions
export const selectApplication = (state: RootState) => state.application
export default applicationSlice.reducer
