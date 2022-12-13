/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import * as redux from '@reduxjs/toolkit'
import axios from 'axios'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import reducer, { reviewState } from './review'
import configureStore from 'redux-mock-store'
import {
	selectAnimal,
	getReviews,
	getReview,
	createReview,
	deleteReview
} from './review'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('review reducer', () => {
	let store: redux.EnhancedStore<
		{ review: reviewState },
		redux.AnyAction,
		[ThunkMiddleware<{ review: reviewState }, redux.AnyAction, undefined>]
	>
	const fakeReview = {
		id: 1,
		author_id: 1,
		author_name: 'test_author_name',
		title: 'test_title',
		content: 'test_content',
		animal_type: 'test_animal_type',
		photo_path: [],
		species: 'test_species',
		created_at: 'test_created_at'
	}

	beforeAll(() => {
		store = redux.configureStore({ reducer: { review: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			reviews: [],
			selectedReview: null,
			selectedAnimal: ''
		})
	})
	it('should handle selectAnimal', async () => {
		await store.dispatch(selectAnimal('TEST_ANIMAL_TYPE'))
		expect(store.getState().review.selectedAnimal).toEqual(
			'TEST_ANIMAL_TYPE'
		)
	})
	it('should handle getReviews', async () => {
		axios.get = jest
			.fn()
			.mockResolvedValue({ data: { count: 1, results: [fakeReview] } })
		await store.dispatch(getReviews({ page: 1, animal_type: '' }))
		expect(store.getState().review.reviews).toEqual([fakeReview])
	})
	it('should handle getReview', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeReview })
		await store.dispatch(getReview(1))
		expect(store.getState().review.selectedReview).toEqual(fakeReview)
	})
	it('should handle deleteReview', async () => {
		axios.delete = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(deleteReview(1))
		expect(store.getState().review.reviews).toEqual([])
	})
	it('should handle createReview', async () => {
		jest.spyOn(axios, 'post').mockResolvedValue({
			data: fakeReview
		})
		const store = mockStore({})
		const formData = new FormData()
		await store.dispatch(createReview(formData) as any)
		expect(store.getActions()[0].type).toEqual(createReview.pending.type)
		expect(store.getActions()[1]).toEqual(
			expect.objectContaining({
				type: createReview.fulfilled.type,
				payload: fakeReview
			})
		)
	})

	it('should handle error on createReview', async () => {
		const mockAlert = jest.fn()
		global.alert = mockAlert
		jest.spyOn(axios, 'post').mockRejectedValue({
			response: { data: { title: ['error'] } }
		})
		const formData = new FormData()

		await store.dispatch(createReview(formData))
		expect(mockAlert).toHaveBeenCalledWith('ERROR')
	})
	it('should handle null on getReview', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(getReview(1))
		expect(store.getState().review.selectedReview).toEqual(null)
	})
})
