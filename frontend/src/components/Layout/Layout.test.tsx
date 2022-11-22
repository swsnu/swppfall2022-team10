import { render, screen } from '@testing-library/react'
import { getMockStore } from '../../test-utils/mock'
import { MemoryRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import Layout from './Layout'

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null }
})

const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

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
									<div>통과</div>
								</Layout>
							}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
		screen.getByText('개인정보처리방침')
		screen.getByText('입양 절차 소개')
		screen.getByText('통과')
	})
})
