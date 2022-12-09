/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../../test-utils/mock'
import axios from 'axios'
import MyPage from './MyPage'
import { Provider } from 'react-redux'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../../Header/Header', () => () => 'Header')
jest.mock('../../Footer/Footer', () => () => 'Footer')
jest.mock('../../Layout/ScrollToTop', () => () => '')

describe('<MyPage />', () => {
	let myPage: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		myPage = (
			<Provider store={mockStore}>
				<MyPage />
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(myPage)
		await waitFor(() => {
			screen.getByText('아이디:')
			screen.getByText('이메일:')
		})
	})
	it('should navigate to login page when not logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(myPage)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
	})
})
