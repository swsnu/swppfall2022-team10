import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../test-utils/mock'
import Header from './Header'
import { Provider } from 'react-redux'
import * as postSlice from '../../store/slices/post'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

jest.mock('./Dropdown/Dropdown', () => () => 'Dropdown')

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	// user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

describe('<Header />', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	it('should render without errors', () => {
		render(
			<Provider store={mockStore}>
				<Header animalOption={false} pageName={''} />
			</Provider>
		)
		screen.getByText('입양 절차 소개')
		screen.getByText('입양 게시글')
		screen.getByText('입양 후기')
		screen.getByText('Q&A')
	})
	it('should render animal type header without errors: post', () => {
		render(
			<Provider store={mockStore}>
				<Header animalOption={true} pageName={'post'} />
			</Provider>
		)
		screen.getByText('개')
		screen.getByText('고양이')
		screen.getByText('기타')
	})
	it('should render animal type header without errors: review', () => {
		render(
			<Provider store={mockStore}>
				<Header animalOption={true} pageName={'review'} />
			</Provider>
		)
		screen.getByText('개')
		screen.getByText('고양이')
		screen.getByText('기타')
	})
	it('should navigate to corresponding pages', async () => {
		render(
			<Provider store={mockStore}>
				<Header animalOption={false} pageName={''} />
			</Provider>
		)
		const introduceButton = screen.getByText('입양 절차 소개')
		fireEvent.click(introduceButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/introduction'))

		expect(screen.getByText('입양 게시글').closest('a')).toHaveAttribute(
			'href',
			'/'
		)
		// const postButton = screen.getByText('입양 게시글')
		// fireEvent.click(postButton)
		// await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
		const reviewButton = screen.getByText('입양 후기')
		fireEvent.click(reviewButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/review')
		)
		const qnaButton = screen.getByText('Q&A')
		fireEvent.click(qnaButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/qna'))
	})
	// it('should show/hide dropdown menu', async () => {
	// 	jest.spyOn(axios, 'get').mockResolvedValue({
	// 		data: { logged_in: true }
	// 	})
	// 	render(
	// 		<Provider store={mockStore}>
	// 			<Header animalOption={false} pageName={''} />
	// 		</Provider>
	// 	)
	// 	const menuButton = screen.getByRole('button', { name: /menu-button/i })
	// 	fireEvent.click(menuButton)
	// 	await waitFor(() => screen.getByText('로그인'))
	// 	fireEvent.click(menuButton)
	// 	await waitFor(() =>
	// 		expect(screen.queryAllByText('로그인')).toHaveLength(0)
	// 	)
	// })
	it('animal type should change when clicked', async () => {
		const mockSelectAnimal = jest.spyOn(postSlice, 'selectAnimal')
		jest.mock('./Dropdown/Dropdown', () => () => 'Dropdown')
		render(
			<Provider store={mockStore}>
				<Header animalOption={true} pageName={'post'} />
			</Provider>
		)
		// jest.spyOn(React, 'useEffect').mockImplementation((f) => null)
		// const setStateMock = jest.fn()
		// const useStateMock: any = (useState: any) => [useState, setStateMock]
		// jest.spyOn(React, 'useState').mockImplementation(useStateMock)

		const dogButton = screen.getByText('개')
		const catButton = screen.getByText('고양이')
		const etcButton = screen.getByText('기타')
		fireEvent.click(dogButton)
		await waitFor(() => {
			expect(mockSelectAnimal).toHaveBeenCalled()
		})
		fireEvent.click(catButton)
		await waitFor(() => {
			expect(mockSelectAnimal).toHaveBeenCalled()
		})
		fireEvent.click(etcButton)
		await waitFor(() => {
			expect(mockSelectAnimal).toHaveBeenCalled()
		})
	})
})
