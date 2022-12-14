import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { Provider } from 'react-redux'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import { getMockStore } from '../../../test-utils/mock'
import * as postSlice from '../../../store/slices/post'
import PostDetail from './PostDetail'

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
jest.mock('../ApplicationList/ApplicationList', () => () => '')
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

describe('<PostDetail />', () => {
	let postDetail: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		postDetail = (
			<Provider store={getMockStore(mockState)}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/post-detail/:id'
							element={<PostDetail is_author={true} />}
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
			render(postDetail)
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
			render(postDetail)
		})
		const editButton = await screen.findByText('??????')
		await waitFor(() => {
			expect(editButton).toBeInTheDocument()
		})
		const deleteButton = await screen.findByText('??????')
		await waitFor(() => {
			expect(deleteButton).toBeInTheDocument()
		})
	})
	it('should render navigate to edit page when edit Button clicked', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				...testPostFormat,
				gender: true,
				vaccination: true,
				neutering: true,
				is_active: true,
				editable: true
			}
		})
		await act(() => {
			render(postDetail)
		})
		const editButton = await screen.findByText('??????')
		fireEvent.click(editButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/post/1/edit')
		)
	})
	it('should delete when delete Button clicked', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				...testPostFormat,
				gender: true,
				vaccination: true,
				neutering: true,
				is_active: true,
				editable: true
			}
		})
		jest.spyOn(axios, 'delete').mockResolvedValue({})
		const mockDeleteArticle = jest.spyOn(postSlice, 'deletePost')
		await act(() => {
			render(postDetail)
		})
		const deleteButton = await screen.findByText('??????')
		fireEvent.click(deleteButton)
		await waitFor(() => expect(mockDeleteArticle).toHaveBeenCalled())
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
	it('should not render if there is no post', async () => {
		await act(() => {
			render(postDetail)
		})
		jest.spyOn(axios, 'get').mockRejectedValue({})
		await waitFor(() => {
			expect(
				screen.queryAllByText('?????? ?????? ????????? ???????????????.')
			).toHaveLength(0)
		})
	})
})
