/* eslint-disable @typescript-eslint/no-unused-vars */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { Provider } from 'react-redux'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import { getMockStore } from '../../../test-utils/mock'
import * as qnaSlice from '../../../store/slices/qna'
import QnaDetail from './QnaDetail'

const mockState = {
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	// user: { users: [], currentUser: null, logged_in: true },
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
jest.mock('../CommentList/CommentList', () => () => '')

const testQnaFormat = {
	id: 1,
	author_id: 1,
	author_name: 'QNA_TEST_AUTHOR',
	title: 'QNA_TEST_TITLE',
	content: 'QNA_TEST_CONTENT',
	created_at: 'QNA_TEST_CREATED_AT'
}

const testCommentFormat = {
	id: 1,
	author_id: 1,
	author_name: 'COMMENT_AUTHOR_NAME',
	content: 'COMMENT_CONTENT',
	created_at: 'COMMENT_CREATED_AT',
	editable: false
}

describe('<QnaDetail />', () => {
	let qnaDetail: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		qnaDetail = (
			<Provider store={getMockStore(mockState)}>
				<MemoryRouter>
					<Routes>
						<Route path='/qna-detail/:id' element={<QnaDetail />} />
						<Route
							path='/'
							element={<Navigate to={'/qna-detail/1'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				...testQnaFormat
			}
		})
		await act(() => {
			render(qnaDetail)
		})

		// await screen.findByText('QNA_TEST_TITLE')
		// await screen.findByText('QNA_TEST_CONTENT')
	})
	it('should render createComment', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		const { container } = render(qnaDetail)
		const commentInput = await screen.findByLabelText('??????:')
		fireEvent.change(commentInput, {
			target: { value: 'COMMENT_TEST_CONTENT' }
		})

		await waitFor(() => {
			expect(commentInput).toHaveValue('COMMENT_TEST_CONTENT')
		})
	})
	it('should not render if there is no qna', async () => {
		await act(() => {
			render(qnaDetail)
		})
		// render(postDetail);
		jest.spyOn(axios, 'get').mockRejectedValue({})
		await waitFor(() => {
			expect(screen.queryAllByText('QNA_TEST_TITLE')).toHaveLength(0)
		})
	})
	it('should render when comment is submitted', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'post').mockResolvedValueOnce({
			data: testCommentFormat
		})
		const { container } = render(qnaDetail)
		const commentInput = await screen.findByLabelText('??????:')
		fireEvent.change(commentInput, {
			target: { value: 'COMMENT_TEST_CONTENT' }
		})

		const commentButton = await screen.findByText('?????? ????????????')
		fireEvent.click(commentButton)
		// await waitFor(() => expect(dispatchEvent).toHaveBeenCalled())
	})
})
