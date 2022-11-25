/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { applicationState } from './application'
import { getApplications } from './application'

describe('application reducer', () => {
	let store: EnhancedStore<
		{ application: applicationState },
		AnyAction,
		[
			ThunkMiddleware<
				{ application: applicationState },
				AnyAction,
				undefined
			>
		]
	>
	const fakeApplication = {
		id: 1,
		author_id: 1,
		author_name: 'test_author_name',
		files: [],
		created_at: 'test_created_at',
		post_id: 1
	}

	beforeAll(() => {
		store = configureStore({ reducer: { application: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			applications: [],
			selectedApplication: null
		})
	})
	it('should handle getApplications', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: [fakeApplication] })
		await store.dispatch(getApplications(1))
		expect(store.getState().application.applications).toEqual([
			fakeApplication
		])
	})
})
