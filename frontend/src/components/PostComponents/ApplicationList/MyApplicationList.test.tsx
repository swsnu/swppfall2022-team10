/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { applicationState } from '../../../store/slices/application'
import { getMockStore } from '../../../test-utils/mock'
import MyApplicationList from './MyApplicationList'
import { act } from 'react-dom/test-utils'

const stubInitialState: applicationState = {
	applications: [
		{
			id: 1,
			author_id: 1,
			author_name: 'Application_Author',
			file: '',
			created_at: 'Application_Date',
			post_id: 1
		}
	],
	selectedApplication: null
}
const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: stubInitialState,
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

describe('<MyApplicationList />', () => {
	let myApplicationList: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		myApplicationList = (
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route
							path='/'
							element={<MyApplicationList id={'1'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render Applicationlist', async () => {
		await act(() => {
			const { container } = render(myApplicationList)
			expect(container).toBeTruthy()
		})
	})
	it('should render table', async () => {
		await act(() => {
			render(myApplicationList)
		})
		const tableRowElement = document.getElementsByTagName('th')
		expect(tableRowElement).toHaveLength(4)
	})
	it('should delete applications', async () => {
		await act(() => {
			render(myApplicationList)
		})
		const button = document.querySelector('#apply-button')
	})
})
