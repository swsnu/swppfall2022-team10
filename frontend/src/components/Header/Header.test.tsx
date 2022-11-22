import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../test-utils/mock'
import axios from 'axios'
import Header from './Header'
import { Provider } from 'react-redux'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null }
})

describe('<Header />', () => {
	it('should render without errors', () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(
			<Provider store={mockStore}>
				<Header animalOption={false} />
			</Provider>
		)
		screen.getByText('입양 절차 소개')
		screen.getByText('입양 게시글')
		screen.getByText('입양 후기')
		screen.getByText('Q&A')
	})
	it('should navigate to corresponding pages', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(
			<Provider store={mockStore}>
				<Header animalOption={false} />
			</Provider>
		)
		const introduceButton = screen.getByText('입양 절차 소개')
		fireEvent.click(introduceButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
		const postButton = screen.getByText('입양 게시글')
		fireEvent.click(postButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
		const reviewButton = screen.getByText('입양 후기')
		fireEvent.click(reviewButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/review')
		)
		const qnaButton = screen.getByText('Q&A')
		fireEvent.click(qnaButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/qna'))
	})
	it('should show/hide dropdown menu', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})
		render(
			<Provider store={mockStore}>
				<Header animalOption={false} />
			</Provider>
		)
		const menuButton = screen.getByRole('button', { name: /menu-button/i })
		fireEvent.click(menuButton)
		await waitFor(() => screen.getByText('로그아웃'))
		fireEvent.click(menuButton)
		await waitFor(() =>
			expect(screen.queryAllByText('로그아웃')).toHaveLength(0)
		)
	})
})
