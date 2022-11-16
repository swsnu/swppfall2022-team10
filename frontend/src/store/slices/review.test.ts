/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { reviewState } from './review'
import {
	getReviews,
	getReview,
	createReview,
	deleteReview,
	editReview
} from './review'

describe('review reducer', () => {
	let store: EnhancedStore<
		{ review: reviewState },
		AnyAction,
		[ThunkMiddleware<{ review: reviewState }, AnyAction, undefined>]
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
		store = configureStore({ reducer: { review: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			reviews: [],
			selectedReview: null
		})
	})
	it('should handle getReviews', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: [fakeReview] })
		await store.dispatch(getReviews())
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
		/* jest.spyOn(axios, "post").mockResolvedValue({
            data: fakeReview,
        });
        await store.dispatch(fakeReview);
        expect(store.getState().review.reviews).toEqual([fakeReview]); */
	})

	it('should handle error on createReview', async () => {
		/* const mockConsoleError = jest.fn();
        console.error = mockConsoleError;
        jest.spyOn(axios, "post").mockRejectedValue({
            response: { data: { title: ["error"] } },
        });
        await store.dispatch(postTodo({ title: "test", content: "test" }));
        expect(mockConsoleError).toBeCalled(); */
	})
	it('should handle null on getReview', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(getReview(1))
		expect(store.getState().review.selectedReview).toEqual(null)
	})
})
