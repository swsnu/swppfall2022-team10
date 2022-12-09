/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
// import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import reducer, { UserState } from './user'
import {
	checkLogin,
	getUser,
	deleteUser,
	checkUsername,
	signupUser,
	editUser,
	loginUser,
	logoutUser
} from './user'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('user reducer', () => {
	// let store: EnhancedStore<
	// 	{ user: UserState },
	// 	AnyAction,
	// 	[ThunkMiddleware<{ user: UserState }, AnyAction, undefined>]
	// >
	const fakeUser = {
		id: 1,
		email: 'test_email',
		password: 'test_password',
		name: 'test_name',
		logged_in: false
	}

	const fakeUserLogin = {
		username: 'test_username',
		password: 'test_password'
	}

	beforeAll(() => {
		// store = configureStore({ reducer: { user: reducer } })
	})
	// it('should handle initial state', () => {
	// 	expect(reducer(undefined, { type: 'unknown' })).toEqual({
	// 		users: [],
	// 		currentUser: null,
	// 		logged_in: false
	// 	})
	// })
	it('should handle checkLogin success', async () => {
		axios.get = jest.fn().mockResolvedValue({
			data: { logged_in: false }
		})

		const store = mockStore({})
		await store.dispatch(checkLogin() as any)

		expect(store.getActions()[0].type).toEqual(checkLogin.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: checkLogin.fulfilled.type,
				payload: { logged_in: false }
			})
		)
	})
	// it('should handle checkLogin fail', async () => {
	// 	axios.get = jest.fn().mockImplementationOnce(() => {
	// 		throw {
	// 			response: { data: { message: 'Error: check Login' } }
	// 		}
	// 	})})

	// 	const store = mockStore({})

	// 	await store.dispatch(checkLogin() as any)
	// 	expect(store.getActions()[0].type).toEqual(checkLogin.pending.type)
	// 	expect(store.getActions()[1]).toEqual(
	// 		expect.objectContaining({
	// 			payload: {
	// 				response: {
	// 					data: {
	// 						message: 'Error: fetch user'
	// 					}
	// 				}
	// 			}
	// 		})
	// 	)
	// })
	it('should handle getUser', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeUser })

		const store = mockStore({})
		await store.dispatch(getUser() as any)

		expect(store.getActions()[0].type).toEqual(getUser.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: getUser.fulfilled.type,
				payload: fakeUser
			})
		)
	})
	it('should handle deleteUser', async () => {
		axios.delete = jest.fn().mockResolvedValue({ status: 204 })

		const store = mockStore({})
		await store.dispatch(deleteUser() as any)

		expect(store.getActions()[0].type).toEqual(deleteUser.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: deleteUser.fulfilled.type,
				payload: 204
			})
		)
	})
	it('should handle checkUsername', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: { confirm: true } })

		const store = mockStore({})
		await store.dispatch(checkUsername('test_username') as any)

		expect(store.getActions()[0].type).toEqual(checkUsername.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: checkUsername.fulfilled.type,
				payload: { confirm: true }
			})
		)
	})
	it('should handle signupUser', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeUserLogin })
		axios.post = jest.fn().mockResolvedValue({ status: 204 })

		const formData = new FormData()
		const store = mockStore({})
		await store.dispatch(signupUser(formData) as any)

		expect(store.getActions()[0].type).toEqual(signupUser.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: signupUser.fulfilled.type,
				payload: 204
			})
		)
	})
	it('should handle editUser', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeUserLogin })
		axios.post = jest.fn().mockResolvedValue({ data: fakeUser })

		const formData = new FormData()
		const store = mockStore({})
		await store.dispatch(editUser(formData) as any)

		expect(store.getActions()[0].type).toEqual(editUser.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: editUser.fulfilled.type,
				payload: fakeUser
			})
		)
	})
	it('should handle loginUser', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeUserLogin })
		axios.post = jest
			.fn()
			.mockResolvedValue({ status: 200, data: fakeUser })

		const store = mockStore({})
		await store.dispatch(
			loginUser({
				username: 'test_username',
				password: 'test_password'
			}) as any
		)

		expect(store.getActions()[0].type).toEqual(loginUser.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: loginUser.fulfilled.type,
				payload: 200
			})
		)
	})
	it('should handle logoutUser', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeUser, status: 204 })

		const store = mockStore({})
		await store.dispatch(logoutUser() as any)

		expect(store.getActions()[0].type).toEqual(logoutUser.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: logoutUser.fulfilled.type,
				payload: true
			})
		)
	})
})
