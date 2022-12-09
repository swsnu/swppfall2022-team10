/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../../test-utils/mock'
import axios from 'axios'
import Signup from './Signup'
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

describe('<Signup />', () => {
	let signUp: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		signUp = (
			<Provider store={mockStore}>
				<Signup />
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(signUp)
		await waitFor(() => {
			expect(screen.getAllByText('회원가입')).toHaveLength(2)
			screen.getByText('아이디')
			screen.getByText('비밀번호')
		})
	})
	it('should navigate to main page when already logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})
		render(signUp)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
})
