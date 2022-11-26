/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { qnaState } from './qna'
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
		hits: 1
	}

	beforeAll(() => {
		store = configureStore({ reducer: { qna: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			qnas: [
				{
					id: 1,
					author_id: 1,
					author_name: 'paw',
					title: 'Be-a-family',
					content: '개가 말을 듣지 않아요. 어떻게 하죠?',
					created_at: '2022-11-20',
					hits: 1
				},
				{
					id: 2,
					author_id: 1,
					author_name: 'paw',
					title: 'Be-a-family',
					content: '고양이가 말을 듣지 않아요. 어떻게 하죠?',
					created_at: '2022-11-20',
					hits: 1
				},
				{
					id: 3,
					author_id: 1,
					author_name: 'paw',
					title: 'Be-a-family',
					content: '앵무새가 말을 듣지 않아요. 어떻게 하죠?',
					created_at: '2022-11-20',
					hits: 1
				},
				{
					id: 4,
					author_id: 1,
					author_name: 'paw',
					title: 'working',
					content: '햄스터가 말을 듣지 않아요. 어떻게 하죠?',
					created_at: '2022-11-11',
					hits: 3
				},
				{
					id: 5,
					author_id: 1,
					author_name: 'paw',
					title: 'eslint sucks',
					content: '친칠라가 말을 듣지 않아요. 어떻게 하죠?',
					created_at: '2022-11-11',
					hits: 3
				},
				{
					id: 6,
					author_id: 1,
					author_name: 'paw',
					title: '6th',
					content: '고슴도치가 말을 듣지 않아요. 어떻게 하죠?',
					created_at: '2022-11-11',
					hits: 4
				}
			],
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
            data: fakeReview,
        });
        await store.dispatch(fakeReview);
        expect(store.getState().review.reviews).toEqual([fakeReview]); */
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
