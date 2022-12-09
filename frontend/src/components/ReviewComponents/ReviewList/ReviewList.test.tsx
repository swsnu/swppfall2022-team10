/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/display-name */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import axios from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import { reviewState } from '../../../store/slices/review'
import { getMockStore } from '../../../test-utils/mock'
import ReviewList from './ReviewList'
import { IProps as ReviewProps } from '../Review/Review'
import { act } from 'react-dom/test-utils'

jest.mock('../Review/Review', () => (props: ReviewProps) => (
	<div data-testid='spyReview'>
		<div>
			{props.title}
			<br />
			작성자: {props.author}
		</div>
	</div>
))

jest.mock('../ReviewDetail/ReviewDetail', () => () => <div>Review Detail</div>)

const stubInitialState: reviewState = {
	reviews: [
		{
			title: 'REVIEW_TITLE_1',
			author_name: 'REVIEW_AUTHOR',
			thumbnail: '',
			id: 1,
			author_id: 1,
			animal_type: 'REVIEW_ANIMAL_TYPE',
			species: 'REVIEW_ANIMAL_SPECIES',
			created_at: 'REVIEW_CREATED_AT',
			post_id: 1
		}
	],
	selectedReview: null,
	selectedAnimal: ''
}
const mockStore = getMockStore({
	review: stubInitialState,
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))
// const mockDispatch = jest.fn()
// jest.mock('react-redux', () => ({
// 	...jest.requireActual('react-redux'),
// 	useDispatch: () => mockDispatch
// }))
const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<ReviewList />', () => {
	let reviewList: JSX.Element
	beforeEach(() => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				count: 1,
				results: [
					{
						title: 'REVIEW_TITLE_1',
						author_name: 'REVIEW_AUTHOR',
						photo_path: [],
						id: 1,
						author_id: 1,
						content: 'REVIEW_CONTENT',
						animal_type: 'REVIEW_ANIMAL_TYPE',
						species: 'REVIEW_ANIMAL_SPECIES',
						created_at: 'REVIEW_CREATED_AT'
					}
				]
			}
		})
		Object.defineProperty(global.window, 'scrollTo', { value: scrollToSpy })
		jest.clearAllMocks()
		reviewList = (
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route path='/' element={<ReviewList />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render ReviewList', async () => {
		await act(() => {
			const { container } = render(reviewList)
			expect(container).toBeTruthy()
		})
	})
	it('should render reviews', async () => {
		await act(() => {
			render(reviewList)
		})
		const reviews = screen.getAllByTestId('spyReview')
		expect(reviews).toHaveLength(1)
	})
	it('should handle createReviewButton', async () => {
		await act(() => {
			render(reviewList)
		})
		const createReviewButton = document.querySelector(
			'#create-review-button'
		)
		fireEvent.click(createReviewButton!)
		expect(mockNavigate).toHaveBeenCalledTimes(1)
	})
	it('should handle modal open and close', async () => {
		await act(() => {
			render(reviewList)
		})
		const button = document.querySelector('.review-container')
		// fireEvent.scroll(window, { target: { scrollY: 100 } });
		fireEvent.click(button!)
		await screen.findByText('Review Detail')
		const closeButton = await screen.findByRole('button', {
			name: /Close/i
		})
		fireEvent.click(closeButton!)
		await waitFor(() => {
			expect(screen.queryByText('Review Detail')).toBeEmptyDOMElement
		})
	})
})
