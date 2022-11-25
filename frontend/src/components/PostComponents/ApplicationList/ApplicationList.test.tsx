/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { applicationState } from '../../../store/slices/application'
import { getMockStore } from '../../../test-utils/mock'
import ApplicationList from './ApplicationList'
import { act } from 'react-dom/test-utils'

const stubInitialState: applicationState = {
	applications: [
		{
			id: 1,
			author_id: 1,
			author_name: 'Application_Author',
			files: [],
			created_at: 'Application_Date',
			post_id: 1
		}
	],
	selectedApplication: null
}
const mockStore = getMockStore({
	user: { users: [], currentUser: null, logged_in: false },
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: stubInitialState,
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [] }
})

describe('<ApplicationList />', () => {
	let applicationList: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		applicationList = (
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/'
							element={<ApplicationList id={'1'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render Applicationlist', async () => {
		await act(() => {
			const { container } = render(applicationList)
			expect(container).toBeTruthy()
		})
	})
	it('should handle modal open and close', async () => {
		await act(() => {
			render(applicationList)
		})
		const button = document.querySelector('#apply-button')
		fireEvent.click(button!)
		const closeButton = await screen.findByRole('button', {
			name: /Close/i
		})
		fireEvent.click(closeButton!)
		!document.querySelector('.Modal')
	})
})
