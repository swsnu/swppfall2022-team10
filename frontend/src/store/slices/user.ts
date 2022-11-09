import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'
export interface UserType {
	id: number
	email: string
	password: string
	name: string
	logged_in: boolean
}
export interface UserLoginType {
	username: string
	password: string
}

export interface UserState {
	users: UserType[]
	currentUser: UserType | null
	logged_in: boolean
}

const initialState: UserState = {
	users: [],
	currentUser: null,
	logged_in: false
}

export const checkLogin = createAsyncThunk(
	'user/checkLogin',
	async (x, { dispatch }) => {
		const response = await axios.get<{ logged_in: boolean }>('/api/check/')
		dispatch(userActions.checkLogin(response.data))
		return response.data
	}
)

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
// const sendLoginRequest = async (username: string, password: string) => {
// 	await axios.get(`/api/token/`) // get csrf token
// 	const response = await axios.post(
// 		`/api/signin/`,
// 		{},
// 		{
// 			auth: {
// 				username: username,
// 				password: password
// 			}
// 		}
// 	)
// 	if (response.status === 200) return true
// 	else return false
// }

export const loginUser = createAsyncThunk(
	'user/loginUser',
	async (userData: UserLoginType, { dispatch }) => {
		await axios.get(`/api/token/`) // get csrf token
		const response = await axios.post(
			`/api/signin/`,
			{},
			{
				auth: {
					username: userData.username,
					password: userData.password
				}
			}
		)
		// console.log(response)
		dispatch(userActions.loginUser({ targetId: 0 }))
		return response.status
		// if (response.status === 200) return true
		// else return false
		// const user = await axios.get(`/api/user/${id}/`)
		// await axios.put(`/api/user/${id}/`, { ...user.data, logged_in: true })
		// dispatch(userActions.loginUser({ targetId: id }))
	}
)

export const logoutUser = createAsyncThunk(
	'user/logoutUser',
	async (id: UserType['id'], { dispatch }) => {
		// const user = await axios.get(`/api/user/${id}/`)
		// await axios.put(`/api/user/${id}/`, { ...user.data, logged_in: false })

		const response = await axios.get(`/api/signout/`)
		dispatch(userActions.logoutUser({ targetId: id }))
		return response.status === 204
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
				state.logged_in = true
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
				state.logged_in = false
			}
		},
		checkLogin: (state, action: PayloadAction<{ logged_in: boolean }>) => {
			state.logged_in = action.payload.logged_in
		}
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getUsers.fulfilled, (state, action) => {
			// Add user to the state array
			state.users = action.payload
		})
		builder.addCase(checkLogin.fulfilled, (state, action) => {
			state.logged_in = action.payload.logged_in
		})
	}
})

export const userActions = userSlice.actions
export const selectUser = (state: RootState): UserState => state.user

export default userSlice.reducer
