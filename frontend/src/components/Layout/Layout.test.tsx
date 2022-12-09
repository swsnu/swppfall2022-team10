import { render, screen } from '@testing-library/react'
import { getMockStore } from '../../test-utils/mock'
import { MemoryRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import Layout from './Layout'

interface IProps {
	animalOption: boolean
	pageName: string
}

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	// user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

const mockHeader = jest.fn()
const Header = (props: IProps) => {
	mockHeader(props)
	return <div>헤더</div>
}
jest.mock('../Header/Header', () => Header)

describe('<Layout />', () => {
	it('should render without errors', () => {
		render(
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/'
							element={
								<Layout>
									<div className='Else'>통과</div>
								</Layout>
							}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
		screen.getByText('헤더')
		screen.getByText('개인정보처리방침')
		screen.getByText('통과')
		expect(mockHeader).toHaveBeenCalledWith(
			expect.objectContaining({
				animalOption: false,
				pageName: ''
			})
		)
	})
	it('should render with post list', () => {
		render(
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/'
							element={
								<Layout>
									<div className='PostListContainer'>
										통과
									</div>
								</Layout>
							}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
		expect(mockHeader).toHaveBeenCalledWith(
			expect.objectContaining({
				animalOption: true,
				pageName: 'post'
			})
		)
	})
	it('should render with review list', () => {
		render(
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/'
							element={
								<Layout>
									<div className='ReviewListContainer'>
										통과
									</div>
								</Layout>
							}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
		expect(mockHeader).toHaveBeenCalledWith(
			expect.objectContaining({
				animalOption: true,
				pageName: 'review'
			})
		)
	})
})
