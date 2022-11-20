/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import ReviewCreate from './ReviewCreate'
import { getMockStore } from '../../../test-utils/mock'
import { Provider } from 'react-redux'
import * as reviewSlice from '../../../store/slices/review'
import { MdArrowBack } from 'react-icons/md'

const tempState = {
	post: { posts: [], selectedPost: null },
	user: { users: [], currentUser: null, logged_in: true },
	review: {
		reviews: [
			{
				id: 1,
				title: 'REVIEW_TEST_TITLE',
				author_id: 1,
				author_name: 'REVIEW_TEST_AUTHOR',
				content: 'REVIEW_TEST_CONTENT',
				animal_type: '강아지',
				photo_path: [],
				species: '치와와',
				created_at: '2022-11-18'
			}
		],
		selectedReview: null
	},
	qna: { qnas: [], selectedQna: null },
}
const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const testPostFormat = {
	id: 1,
	author_id: 1,
	title: 'ARTICLE_TEST_TITLE',
	content: 'ARTICLE_TEST_CONTENT'
}

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../../Header/Header', () => () => 'Header')
jest.mock('../../Footer/Footer', () => () => 'Footer')
jest.mock('../../Layout/ScrollToTop', () => () => '')

describe('<ReviewCreate />', () => {
	let reviewCreate: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		reviewCreate = (
			<Provider store={getMockStore(tempState)}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/review/create'
							element={<ReviewCreate />}
						/>
						<Route
							path='/'
							element={<Navigate to={'/review/create'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render without errors', async () => {
		render(reviewCreate)
		await screen.findByText('입양후기 올리기')
	})
	it('should render button and inputs with original values', async () => {
		render(reviewCreate)
		const titleInput = await screen.findByLabelText('제목:')
		fireEvent.change(titleInput, {
			target: { value: 'ARTICLE_TEST_TITLE' }
		})

		const contentInput = await screen.findByLabelText(
			'입양 후기를 알려주세요! 자세한 후기는 입양에 도움이 됩니다:)'
		)
		fireEvent.change(contentInput, {
			target: { value: 'ARTICLE_TEST_CONTENT' }
		})

		await screen.findByText('게시하기')
		await waitFor(() =>
			expect(titleInput).toHaveValue('ARTICLE_TEST_TITLE')
		)
		await waitFor(() =>
			expect(contentInput).toHaveValue('ARTICLE_TEST_CONTENT')
		)
	})
	it('should render navigate to /review when submitted', async () => {
		jest.spyOn(axios, 'post').mockResolvedValueOnce({
			data: {
				id: 1,
				author_id: 1,
				title: 'NEW_TITLE',
				content: 'NEW_CONTENT'
			}
		})
		const { container } = render(reviewCreate)
		const titleInput = await screen.findByLabelText('제목:')
		const contentInput = await screen.findByLabelText(
			'입양 후기를 알려주세요! 자세한 후기는 입양에 도움이 됩니다:)'
		)
		const reviewButton = screen.getByText('게시하기')
		fireEvent.change(titleInput, { target: { value: 'NEW_TITLE' } })
		fireEvent.change(contentInput, { target: { value: 'NEW_CONTENT' } })
		const file: Partial<File> = {
			name: 'myimage.png',
			lastModified: 1580400631732,
			size: 703786,
			type: 'image/png'
		}
		const fileInput = container.querySelector('input[name="photo"]')
		if (fileInput !== null)
			fireEvent.change(fileInput, { target: { files: [file] } })
		await screen.findByDisplayValue('NEW_TITLE')
		await screen.findByDisplayValue('NEW_CONTENT')
		fireEvent.click(reviewButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/review')
		)
	})
	it('should render navigate to / when back Button clicked', async () => {
		render(reviewCreate)
		const backButton = await screen.findByRole('button', {
			name: /back-button/i
		})

		fireEvent.click(backButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/review')
		)
	})
})
