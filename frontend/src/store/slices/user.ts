/* eslint-disable object-shorthand */
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface UserSignupType {
	username: string
	email: string
	password: string | null
}
export interface UserLoginType {
	username: string
	password: string
}
export interface UserType {
	username: string
	email: string
	photo_path: string
}

export const checkLogin = createAsyncThunk(
	'user/checkLogin',
	async (x, { dispatch }) => {
		const response = await axios.get<{ logged_in: boolean }>('/api/check/')
		return response.data
	}
)

export const getUser = createAsyncThunk('user/getUser', async () => {
	const response = await axios.get(`/api/users/info`)
	return response.data
})

export const deleteUser = createAsyncThunk('user/deleteUser', async () => {
	const response = await axios.delete(`/api/users/`)
	return response.status
})

export const checkUsername = createAsyncThunk(
	'user/checkUsername',
	async (username: string, { dispatch }) => {
		const response = await axios.get<{ confirm: boolean }>(
			'/api/username/',
			{ params: { username: username } }
		)
		return response.data
	}
)

export const signupUser = createAsyncThunk(
	'user/signupUser',
	async (user: FormData, { dispatch }) => {
		await axios.get(`/api/token/`) // get csrf token
		const response = await axios.post(`/api/signup/`, user)
		return response.status
	}
)

export const editUser = createAsyncThunk(
	'user/editUser',
	async (user: FormData, { dispatch }) => {
		await axios.get(`/api/token/`) // get csrf token
		const response = await axios.post(`/api/edit/`, user)
		return response.data
	}
)

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
		return response.status
	}
)

export const logoutUser = createAsyncThunk(
	'user/logoutUser',
	async (x, { dispatch }) => {
		const response = await axios.get(`/api/signout/`)
		return response.status === 204
	}
)
