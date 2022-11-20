/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { reviewState } from '../../../store/slices/review'
import { getMockStore } from '../../../test-utils/mock'
import ReviewList from './ReviewList'
import { IProps as ReviewProps } from '../Review/Review'

jest.mock('../Review/Review', () => (props: ReviewProps) => (
	<div data-testid='spyReview'>
		<div>
			{props.title}
			<br />
			작성자: {props.author}
		</div>
	</div>
))

const stubInitialState: reviewState = {
	reviews: [
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
	],
	selectedReview: null
}
const mockStore = getMockStore({
	review: stubInitialState,
	user: { users: [], currentUser: null, logged_in: false },
	post: { posts: [], selectedPost: null },
	qna: { qnas: [], selectedQna: null },
})

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	useDispatch: () => mockDispatch
}))
const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<ReviewList />', () => {
	let reviewList: JSX.Element
	beforeEach(() => {
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
		const { container } = render(reviewList)
		expect(container).toBeTruthy()
	})
	it('should render reviews', () => {
		render(reviewList)
		const reviews = screen.getAllByTestId('spyReview')
		expect(reviews).toHaveLength(1)
	})
	it('should handle createReviewButton', () => {
		render(reviewList)
		const createReviewButton = document.querySelector(
			'#create-review-button'
		)
		fireEvent.click(createReviewButton!)
		expect(mockNavigate).toHaveBeenCalledTimes(1)
	})
	it('should handle modal open and close', async () => {
		render(reviewList)
		const button = document.querySelector('.review-container')
		// fireEvent.scroll(window, { target: { scrollY: 100 } });
		const top = '-'.concat(global.window.scrollY.toString()).concat('px')
		fireEvent.click(button!)
		const closeButton = await screen.findByRole('button', {
			name: /Close/i
		})
		fireEvent.click(closeButton!)
		!document.querySelector('.Modal')
		expect(scrollToSpy).toHaveBeenCalledWith(
			0,
			parseInt(top || '0', 10) * -1
		)
	})
})
