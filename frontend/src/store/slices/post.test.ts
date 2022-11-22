/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkMiddleware } from 'redux-thunk'
import reducer, { postState } from './post'
import { getPosts, getPost, createPost, deletePost, editPost } from './post'

describe('post reducer', () => {
	let store: EnhancedStore<
		{ post: postState },
		AnyAction,
		[ThunkMiddleware<{ post: postState }, AnyAction, undefined>]
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

	const fakePostCreate = {
		author_id: 1,
		title: 'test_title',
		name: 'test_name',
		animal_type: 'test_animal_type',
		species: 'test_species',
		age: 1,
		gender: false,
		vaccination: false,
		neutering: false,
		content: 'test_content'
	}

	beforeAll(() => {
		store = configureStore({ reducer: { post: reducer } })
	})
	it('should handle initial state', () => {
		expect(reducer(undefined, { type: 'unknown' })).toEqual({
			posts: [],
			selectedPost: null
		})
	})
	it('should handle getPosts', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: [fakePost] })
		await store.dispatch(getPosts(1))
		expect(store.getState().post.posts).toEqual([fakePost])
	})
	it('should handle getPost', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: fakePost })
		await store.dispatch(getPost(1))
		expect(store.getState().post.selectedPost).toEqual(fakePost)
	})
	it('should handle deletePost', async () => {
		axios.delete = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(deletePost(1))
		// expect(store.getState().post.posts).toEqual([]);
	})
	it('should handle createPost', async () => {
		/* jest.spyOn(axios, "post").mockResolvedValue({
            data: fakePost,
        });
        await store.dispatch(createPost(FormData)));
    expect(store.getState().post.posts).toEqual([fakePost]); */
	})
	it('should handle editPost', async () => {
		jest.spyOn(axios, 'put').mockResolvedValue({
			data: fakePost
		})
		await store.dispatch(editPost(fakePost))
		expect(
			store.getState().post.posts.find((v) => v.id === fakePost.id)?.id
		).toEqual(1)
	})

	it('should handle error on createPost', async () => {
		/* const mockConsoleError = jest.fn();
        console.error = mockConsoleError;
        jest.spyOn(axios, "post").mockRejectedValue({
            response: { data: { title: ["error"] } },
        });
        await store.dispatch(postTodo({ title: "test", content: "test" }));
        expect(mockConsoleError).toBeCalled(); */
	})
	it('should handle null on getPost', async () => {
		axios.get = jest.fn().mockResolvedValue({ data: null })
		await store.dispatch(getPost(1))
		expect(store.getState().post.selectedPost).toEqual(null)
	})
})
