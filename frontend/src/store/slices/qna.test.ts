/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { editQna, qnaState } from './qna'
import { getQnas, getQna, createQna, deleteQna } from './qna'

describe('qna reducer', () => {
	let store: EnhancedStore<
		{ qna: qnaState },
		AnyAction,
		[ThunkMiddleware<{ qna: qnaState }, AnyAction, undefined>]
	>
	const fakeQna = {
		id: 1,
		author_id: 1,
		author_name: 'test_author_name',
		title: 'test_title',
		content: 'test_content',
		created_at: 'test_created_at',
		hits: 1,
		comments: [],
		editable: false
	}

	const fakeComment = {
		content: 'test_content',
		id: 1
	}

	beforeAll(() => {
		store = configureStore({ reducer: { qna: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			qnas: [],
			selectedQna: null
		})
	})
	it('should handle getQnas', async () => {
		axios.get = jest
			.fn()
			.mockResolvedValue({ data: { count: 1, results: [fakeQna] } })
		await store.dispatch(getQnas({ page: 1 }))
		expect(store.getState().qna.qnas).toEqual([fakeQna])
	})
	it('should handle getQna', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakeQna })
		await store.dispatch(getQna(1))
		expect(store.getState().qna.selectedQna).toEqual(fakeQna)
	})
	it('should handle deleteQna', async () => {
		axios.delete = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(deleteQna(1))
		expect(store.getState().qna.qnas).toEqual([])
	})
	it('should handle createQnas', async () => {
		/* jest.spyOn(axios, "post").mockResolvedValue({
			data: fakeQna,
		});
		await store.dispatch(fakeQna);
		expect(store.getState().review.reviews).toEqual([fakeReview]); */
	})
	it('should handle editQna', async () => {
		jest.spyOn(axios, 'put').mockResolvedValue({
			data: fakeQna
		})
		await store.dispatch(editQna(fakeQna))
		expect(
			store
				.getState()
				.qna.qnas.find((v) => v.author_id === fakeQna.author_id)?.id
		).toEqual(undefined)
	})
	it('should handle error on createQna', async () => {
		/* const mockConsoleError = jest.fn();
		console.error = mockConsoleError;
		jest.spyOn(axios, "post").mockRejectedValue({
			response: { data: { title: ["error"] } },
		});
		await store.dispatch(postTodo({ title: "test", content: "test" }));
		expect(mockConsoleError).toBeCalled(); */
	})
	it('should handle null on getQna', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(getQna(1))
		expect(store.getState().qna.selectedQna).toEqual(null)
	})
})
