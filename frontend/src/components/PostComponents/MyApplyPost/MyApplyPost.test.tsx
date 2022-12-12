/* eslint-disable @typescript-eslint/no-unused-vars */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { Provider } from 'react-redux'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import { getMockStore } from '../../../test-utils/mock'
import * as postSlice from '../../../store/slices/post'
import MyApplyPost from './MyApplyPost'

const testPost = {
	id: 1,
	author_id: 1,
	author_name: 'POST_TEST_AUTHOR',
	name: 'POST_TEST_NAME',
	title: 'POST_TEST_TITLE',
	animal_type: 'POST_TEST_ANIMAL_TYPE',
	photo_path: [],
	species: 'POST_TEST_SPECIES',
	age: 0,
	content: 'POST_TEST_CONTENT',
	created_at: 'POST_TEST_CREATED_AT',
	gender: true,
	vaccination: true,
	neutering: true,
	is_active: true,
	form: ''
}

const mockState = {
	post: { posts: [], selectedPost: testPost, selectedAnimal: '' },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
}

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../../Header/Header', () => () => 'Header')
jest.mock('../../Footer/Footer', () => () => 'Footer')
jest.mock('../../Layout/ScrollToTop', () => () => '')
jest.mock('../ApplicationList/MyApplicationList', () => () => '')
jest.mock('../PostHeader/PostHeader', () => () => '')

const testPostFormat = {
	id: 1,
	author_id: 1,
	author_name: 'POST_TEST_AUTHOR',
	name: 'POST_TEST_NAME',
	title: 'POST_TEST_TITLE',
	animal_type: 'POST_TEST_ANIMAL_TYPE',
	photo_path: [],
	species: 'POST_TEST_SPECIES',
	age: 0,
	content: 'POST_TEST_CONTENT',
	created_at: 'POST_TEST_CREATED_AT'
}

describe('<MyApplyPost />', () => {
	let myApplyPost: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		myApplyPost = (
			<Provider store={getMockStore(mockState)}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/post-detail/:id'
							element={<MyApplyPost />}
						/>
						<Route
							path='/'
							element={<Navigate to={'/post-detail/1'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				post: {
					...testPostFormat,
					gender: true,
					vaccination: true,
					neutering: true,
					is_active: true,
					editable: true
				},
				editable: true,
				bookmark: true
			}
		})
		await act(() => {
			render(myApplyPost)
		})
		await screen.findByText(/POST_TEST_SPECIES/)
	})
	it('should render edit/delete button when user is the author', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				post: {
					...testPostFormat,
					gender: true,
					vaccination: true,
					neutering: true,
					is_active: true
				},
				editable: true,
				bookmark: true
			}
		})
		await act(() => {
			render(myApplyPost)
		})
		const editButton = await screen.findByText('수정')
		await waitFor(() => {
			expect(editButton).toBeInTheDocument()
		})
		const deleteButton = await screen.findByText('삭제')
		await waitFor(() => {
			expect(deleteButton).toBeInTheDocument()
		})
	})
	it('should not render if there is no post', async () => {
		await act(() => {
			render(myApplyPost)
		})
		jest.spyOn(axios, 'get').mockRejectedValue({})
		await waitFor(() => {
			expect(
				screen.queryAllByText('백신 접종 완료한 동물입니다.')
			).toHaveLength(0)
		})
	})
	it('should handle edit and delete button', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				post: {
					...testPostFormat,
					gender: true,
					vaccination: true,
					neutering: true,
					is_active: true
				},
				editable: true,
				bookmark: true
			}
		})
		await act(() => {
			render(myApplyPost)
		})
		const edit_button = document.querySelector('#edit-post-button')
		fireEvent.click(edit_button!)
		expect(mockNavigate).toHaveBeenCalledTimes(1)

		const delete_button = document.querySelector('#delete-post-button')
		fireEvent.click(delete_button!)
		expect(mockNavigate).toHaveBeenCalledTimes(2)
	})

})
