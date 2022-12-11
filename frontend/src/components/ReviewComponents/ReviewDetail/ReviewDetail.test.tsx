import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { Provider } from 'react-redux'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import { getMockStore } from '../../../test-utils/mock'
import * as ReviewSlice from '../../../store/slices/review'
import ReviewDetail from './ReviewDetail'
import {postListType} from "../../../store/slices/post";
import PostDetail from "../../PostComponents/PostDetail/PostDetail";

const testReview = {
	id: 1,
	author_id: 1,
	author_name: 'REVIEW_TEST_AUTHOR',
	title: 'REVIEW_TEST_TITLE',
	content: 'REVIEW_TEST_CONTENT',
	animal_type: 'REVIEW_TEST_ANIMAL_TYPE',
	photo_path: [],
	species: 'REVIEW_TEST_SPECIES',
	created_at: 'REVIEW_TEST_CREATED_AT',
	post: {
		id: 1,
		author_name: 'POST_TEST_AUTHOR',
		title: 'POST_TEST_AUTHOR',
		animal_type: 'POST_TEST_ANIMAL_TYPE',
		thumbnail: '',
		species: 'POST_TEST_SPECIES',
		age: 2,
		gender: true
	}
}

const mockState = {
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	review: { reviews: [], selectedReview: testReview, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
}

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const testReviewFormat = {
	id: 1,
	author_id: 1,
	author_name: 'REVIEW_TEST_AUTHOR',
	title: 'REVIEW_TEST_TITLE',
	content: 'REVIEW_TEST_CONTENT',
	animal_type: 'REVIEW_TEST_ANIMAL_TYPE',
	photo_path: [],
	species: 'REVIEW_TEST_SPECIES',
	created_at: 'REVIEW_TEST_CREATED_AT',
	post: {
		id: 1,
		author_name: 'POST_TEST_AUTHOR',
		title: 'POST_TEST_AUTHOR',
		animal_type: 'POST_TEST_ANIMAL_TYPE',
		thumbnail: '',
		species: 'POST_TEST_SPECIES',
		age: 2,
		gender: true
	}
}

describe('<ReviewDetail />', () => {
	let reviewDetail: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		reviewDetail = (
			<Provider store={getMockStore(mockState)}>
				<ReviewDetail
					id={1}
				/>
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				testReviewFormat
			}
		})
		await act(() => {
			render(reviewDetail)
		})

		screen.getByText('REVIEW_TEST_TITLE')
		screen.getByText(/REVIEW_TEST_AUTHOR/)
		screen.getByText(/REVIEW_TEST_CONTENT/)
	})
})
