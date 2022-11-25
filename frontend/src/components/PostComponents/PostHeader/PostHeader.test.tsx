import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PostHeader from './PostHeader'
import { Provider } from 'react-redux'
import { getMockStore } from '../../../test-utils/mock'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

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
			photo_path: ['POST_TEST_PHOTO_PATH'],
			species: 'POST_TEST_SPECIES',
			age: 0,
			content: 'POST_TEST_CONTENT',
			created_at: 'POST_TEST_CREATED_AT',
			gender: true,
			vaccination: true,
			neutering: true,
			is_active: true,
			editable: true
		},
		selectedAnimal: ''
	},
	user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null }
}

describe('<PostHeader />', () => {
	it('should render without errors', async () => {
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader is_author={false} />
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
				<PostHeader is_author={true} />
			</Provider>
		)
		await waitFor(() => {
			expect(screen.queryByText('입양하기')).not.toBeInTheDocument()
		})
	})
	it('should render without errors', async () => {
		render(
			<Provider store={getMockStore(tempState)}>
				<PostHeader is_author={true} />
			</Provider>
		)
		const bookmarkButton = await screen.findByRole('button', {
			name: /bookmark-button/i
		})
		fireEvent.click(bookmarkButton)
	})
})
