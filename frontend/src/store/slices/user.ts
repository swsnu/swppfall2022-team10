import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export interface UserType {
	id: number
	email: string
	password: string
	name: string
	logged_in: boolean
}

export interface UserState {
	users: UserType[]
	currentUser: UserType | null
}

const initialState: UserState = {
	users: [],
	currentUser: null
}

export const getUsers = createAsyncThunk('user/getUsers', async () => {
	const response = await axios.get<UserType[]>(`/api/user/`)
	return response.data
})

export const getUser = createAsyncThunk(
	'user/getUsers',
	async (id: UserType['id']) => {
		const response = await axios.get(`/api/user/${id}/`)
		return response.data
	}
)

// example for login request
const sendLoginRequest = async (username: string, password: string) => {
	await axios.get(`/api/token/`) // get csrf token
	const response = await axios.post(
		`/api/signin/`,
		{},
		{
			auth: {
				username: username,
				password: password
			}
		}
	)
	if (response.status === 200) return true
	else return false
}

export const loginUser = createAsyncThunk(
	'user/loginUser',
	async (id: UserType['id'], { dispatch }) => {
		const user = await axios.get(`/api/user/${id}/`)
		await axios.put(`/api/user/${id}/`, { ...user.data, logged_in: true })
		dispatch(userActions.loginUser({ targetId: id }))
	}
)

export const logoutUser = createAsyncThunk(
	'user/logoutUser',
	async (id: UserType['id'], { dispatch }) => {
		const user = await axios.get(`/api/user/${id}/`)
		await axios.put(`/api/user/${id}/`, { ...user.data, logged_in: false })
		dispatch(userActions.logoutUser({ targetId: id }))
	}
)

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginUser: (state, action: PayloadAction<{ targetId: number }>) => {
			const user = state.users.find(
				(value: UserType) => value.id === action.payload.targetId
			)
			if (user != null) {
				user.logged_in = !user.logged_in
				state.currentUser = user
			}
		},
		logoutUser: (state, action: PayloadAction<{ targetId: number }>) => {
			if (
				state.currentUser != null &&
				state.currentUser.id === action.payload.targetId
			) {
				const user = state.users.find(
					(value: UserType) => value.id === action.payload.targetId
				)
				if (user != null) user.logged_in = !user.logged_in
				state.currentUser = null
			}
		}
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getUsers.fulfilled, (state, action) => {
			// Add user to the state array
			state.users = action.payload
		})
	}
})

export const userActions = userSlice.actions
export const selectUser = (state: RootState): UserState => state.user

export default userSlice.reducer
