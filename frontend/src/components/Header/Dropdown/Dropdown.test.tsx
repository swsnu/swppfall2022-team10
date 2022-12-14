import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../../test-utils/mock'
import axios from 'axios'
import Dropdown from './Dropdown'
import { Provider } from 'react-redux'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	// user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})
describe('<Dropdown />', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	it('should render without errors when logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})
		await act(() => {
			render(
				<Provider store={mockStore}>
					<Dropdown visibility={true} />
				</Provider>
			)
		})

		await screen.findByText('내 회원정보')
		await screen.findByText('내 포스트')
		await screen.findByText('로그아웃')
	})
	it('should render without errors when logged out', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})

		await act(() => {
			render(
				<Provider store={mockStore}>
					<Dropdown visibility={true} />
				</Provider>
			)
		})
		await screen.findByText('로그인')
		await screen.findByText('회원가입')
	})
	it('should navigate to corresponding pages when logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})

		await act(() => {
			render(
				<Provider store={mockStore}>
					<Dropdown visibility={true} />
				</Provider>
			)
		})
		const infoButton = await screen.findByText('내 회원정보')
		fireEvent.click(infoButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/myinfo')
		)
		const postButton = await screen.findByText('내 포스트')
		fireEvent.click(postButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/mypost')
		)
		const reviewButton = await screen.findByText('로그아웃')
		fireEvent.click(reviewButton)
		// await waitFor(() =>
		// 	expect(mockDispatch).toHaveBeenCalledTimes(1)
		// );
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
	})
	it('should navigate to corresponding pages when logged out', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})

		await act(() => {
			render(
				<Provider store={mockStore}>
					<Dropdown visibility={true} />
				</Provider>
			)
		})
		const loginButton = await screen.findByText('로그인')
		fireEvent.click(loginButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
		const signupButton = await screen.findByText('회원가입')
		fireEvent.click(signupButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/signup')
		)
	})
	it('should hide dropdown menu', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})

		await act(() => {
			render(
				<Provider store={mockStore}>
					<Dropdown visibility={false} />
				</Provider>
			)
		})
		await waitFor(() =>
			expect(screen.queryAllByText('로그아웃')).toHaveLength(0)
		)
	})
})
