import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PostHeader from './PostHeader'
import { Provider } from 'react-redux'
import { getMockStore } from '../../../test-utils/mock'
import axios from 'axios'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const alert = jest.fn()
global.alert = alert

const tempState = {
	post: {
		posts: [],
		selectedPost: {
			id: 1,
			author_id: 1,
			author_name: 'POST_TEST_AUTHOR',
			name: 'POST_TEST_NAME',
			title: 'POST_TEST_TITLE',
			animal_type: 'POST_TEST_ANIMAL_TYPE',
			photo_path: [{ id: 1, photo_path: 'POST_TEST_PHOTO_PATH' }],
			species: 'POST_TEST_SPECIES',
			age: 0,
			content: 'POST_TEST_CONTENT',
			created_at: 'POST_TEST_CREATED_AT',
			gender: true,
			vaccination: true,
			neutering: true,
			is_active: true,
			editable: true,
			form: ''
		},
		selectedAnimal: ''
	},
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
}

const tempNullState = {
	post: {
		posts: [],
		selectedPost: null,
		selectedAnimal: ''
	},
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
}

describe('<PostHeader />', () => {
	it('should render without errors', async () => {
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={false}
					is_bookmark={true}
					setBookmark={(number) => null}
				/>
			</Provider>
		)
		await screen.findByText('POST_TEST_TITLE')
		await screen.findByText(/POST_TEST_SPECIES/)
		await screen.findByText(/암컷/)
		await screen.findByText(/POST_TEST_AUTHOR/)
		await screen.findByText(/POST_TEST_CREATED_AT/)
		await screen.findByText('입양상담 진행 중')
		await screen.findByText('입양하기')
		await screen.findByAltText('POST_TEST_ANIMAL_TYPE')
	})
	it('should not render adopt button when author', async () => {
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={true}
					is_bookmark={true}
					setBookmark={(number) => null}
				/>
			</Provider>
		)
		await waitFor(() => {
			expect(screen.queryByText('입양하기')).not.toBeInTheDocument()
		})
	})
	it('should bookmark when bookmark button clicked', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'put').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={true}
					is_bookmark={false}
					setBookmark={(number) => null}
				/>
			</Provider>
		)

		const bookmarkButton = await screen.findByRole('button', {
			name: /bookmark-button/i
		})
		fireEvent.click(bookmarkButton)
		await screen.findByRole('button', {
			name: /bookmarked/i
		})
	})
	it('should navigate when not logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={true}
					is_bookmark={false}
					setBookmark={(number) => null}
				/>
			</Provider>
		)

		const bookmarkButton = await screen.findByRole('button', {
			name: /bookmark-button/i
		})
		fireEvent.click(bookmarkButton)
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/login')
		})
	})
	it('should error when check login failed', async () => {
		jest.spyOn(axios, 'get').mockRejectedValueOnce({
			err: 'error'
		})
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={true}
					is_bookmark={false}
					setBookmark={(number) => null}
				/>
			</Provider>
		)

		const bookmarkButton = await screen.findByRole('button', {
			name: /bookmark-button/i
		})
		fireEvent.click(bookmarkButton)
		await waitFor(() => {
			expect(alert).toHaveBeenCalledWith('ERROR')
		})
	})
	it('should error when bookmark failed', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'put').mockRejectedValueOnce({
			err: 'error'
		})
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={true}
					is_bookmark={false}
					setBookmark={(number) => null}
				/>
			</Provider>
		)

		const bookmarkButton = await screen.findByRole('button', {
			name: /bookmark-button/i
		})
		fireEvent.click(bookmarkButton)
		await waitFor(() => {
			expect(alert).toHaveBeenCalledWith('ERROR')
		})
	})
	it('should not bookmark when selectedPost is null', async () => {
		render(
			<Provider store={getMockStore(tempNullState)}>
				<PostHeader
					is_author={true}
					is_bookmark={false}
					setBookmark={(number) => null}
				/>
			</Provider>
		)

		const bookmarkButton = await screen.findByRole('button', {
			name: /bookmark-button/i
		})
		fireEvent.click(bookmarkButton)
		await screen.findByRole('button', {
			name: /un-bookmarked/i
		})
	})
	it('should navigate to submit page when adopt button clicked', async () => {
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader
					is_author={false}
					is_bookmark={true}
					setBookmark={(number) => null}
				/>
			</Provider>
		)
		const adoptButton = await screen.findByText('입양하기')
		fireEvent.click(adoptButton)
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('./submit')
		})
	})
})
