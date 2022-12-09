/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { mypostState } from './mypost'
import { getMyPosts } from './mypost'

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
			.mockResolvedValue({ data: [[fakePost], [fakePost], [fakePost]] })
		await store.dispatch(getMyPosts())
		expect(store.getState().mypost.posts).toEqual([fakePost])
		expect(store.getState().mypost.likes).toEqual([fakePost])
		expect(store.getState().mypost.applys).toEqual([fakePost])
	})
})
