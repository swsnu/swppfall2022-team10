/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { mypostState } from './mypost'
import { getMyPosts, deleteReview, deleteQna } from './mypost'
import {commentType} from "./qna";

describe('mypost reducer', () => {
	let store: EnhancedStore<
		{ mypost: mypostState },
		AnyAction,
		[ThunkMiddleware<{ mypost: mypostState }, AnyAction, undefined>]
	>
	const fakePost = {
		id: 1,
		author_id: 1,
		author_name: 'test_author_name',
		name: 'test_name',
		vaccination: false,
		neutering: false,
		title: 'test_title',
		animal_type: 'test_animal_type',
		photo_path: [],
		species: 'test_species',
		age: 1,
		gender: false,
		content: 'test_content',
		created_at: 'test_created_at',
		is_active: false,
		editable: true
	}
	const fakeReview = {
		title: 'REVIEW_TITLE_1',
		author_name: 'REVIEW_AUTHOR',
		thumbnail: '',
		id: 1,
		author_id: 1,
		animal_type: 'REVIEW_ANIMAL_TYPE',
		species: 'REVIEW_ANIMAL_SPECIES',
		created_at: 'REVIEW_CREATED_AT',
		post_id: 1
	}
	const fakeQna = {
		id: 1,
		author_id: 1,
		author_name: 'POST_AUTHOR',
		title: 'POST_TITLE_1',
		content: 'POST_CONTENT',
		created_at: '',
		hits: 3,
		comments: [],
		editable: true
	}

	beforeAll(() => {
		store = configureStore({ reducer: { mypost: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			posts: [],
			likes: [],
			applys: [],
			qnas: [],
			reviews: []
		})
	})
	it('should handle getMyPosts', async () => {
		axios.get = jest
			.fn()
			.mockResolvedValue({ data: [[fakePost], [fakePost], [fakePost], [fakeReview], [fakeQna]] })
		await store.dispatch(getMyPosts())
		expect(store.getState().mypost.posts).toEqual([fakePost])
		expect(store.getState().mypost.likes).toEqual([fakePost])
		expect(store.getState().mypost.applys).toEqual([fakePost])
		expect(store.getState().mypost.reviews).toEqual([fakeReview])
		expect(store.getState().mypost.qnas).toEqual([fakeQna])
	})
	it('should handle deleteQna', async () => {
		axios.get = jest
			.fn()
			.mockResolvedValue({ data: [[fakePost], [fakePost], [fakePost], [fakeReview], [fakeQna]] })
		axios.delete = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(deleteQna(1))
		expect(store.getState().mypost.qnas).toEqual([]);
	})
	it('should handle deleteReview', async () => {
		axios.get = jest
			.fn()
			.mockResolvedValue({ data: [[fakePost], [fakePost], [fakePost], [fakeReview], [fakeQna]] })
		axios.delete = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(deleteReview(1))
		expect(store.getState().mypost.reviews).toEqual([]);
	})
})
