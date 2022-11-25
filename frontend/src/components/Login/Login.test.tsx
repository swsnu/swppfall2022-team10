import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../test-utils/mock'
import axios from 'axios'
import LogIn from './Login'
import { Provider } from 'react-redux'

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

// const mockDispatch = jest.fn();
// jest.mock("react-redux", () => ({
// 	...jest.requireActual("react-redux"),
// 	useDispatch: () => mockDispatch,
// }));

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [] }
})

jest.mock('../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../Header/Header', () => () => 'Header')
jest.mock('../Footer/Footer', () => () => 'Footer')
jest.mock('../Layout/ScrollToTop', () => () => '')

describe('<Login />', () => {
	let logIn: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		logIn = (
			<Provider store={mockStore}>
				<LogIn />
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(logIn)
		await waitFor(() => {
			expect(screen.getAllByText('로그인')).toHaveLength(2)
			screen.getByPlaceholderText('아이디')
			screen.getByPlaceholderText('비밀번호')
			screen.getByText('회원가입')
		})
	})
	it('should navigate to main page when already logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})
		render(logIn)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
	it('should navigate to signup page when signup button clicked', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(logIn)
		await waitFor(() =>
			expect(screen.getByText('회원가입').closest('a')).toHaveAttribute(
				'href',
				'/signup'
			)
		)
	})
	it('should handle login', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})

		jest.spyOn(axios, 'post').mockResolvedValueOnce({
			status: 200
		})
		render(logIn)
		const loginButton = screen.getAllByText('로그인')[1]
		fireEvent.click(loginButton)

		const idInput = screen.getByPlaceholderText('아이디')
		const passwordInput = screen.getByPlaceholderText('비밀번호')
		fireEvent.change(idInput, { target: { value: 'seorin55' } })
		fireEvent.change(passwordInput, { target: { value: 'password' } })
		expect(idInput).toHaveValue('seorin55')
		expect(passwordInput).toHaveValue('password')

		// await waitFor(() =>
		//     expect(mockDispatch).toHaveBeenCalledTimes(1)
		// );
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
	it('should handle login error', async () => {
		window.alert = jest.fn()
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})

		jest.spyOn(axios, 'post').mockRejectedValueOnce({})
		render(logIn)
		const loginButton = screen.getAllByText('로그인')[1]
		fireEvent.click(loginButton)

		// await waitFor(() =>
		//     expect(mockDispatch).toHaveBeenCalledTimes(1)
		// );
		await waitFor(() =>
			expect(window.alert).toHaveBeenCalledWith('ID or Password wrong')
		)
	})
})
