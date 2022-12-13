/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import axios from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import { postListType } from '../../../store/slices/post'
import { reviewListType } from '../../../store/slices/review'
import { QnaType } from '../../../store/slices/qna'
import { getMockStore } from '../../../test-utils/mock'
import MyPost from './MyPost'
import { IProps as PostProps } from '../Post/Post'
import { act } from 'react-dom/test-utils'
import { commentType } from '../../../store/slices/qna'
import { IProps as ReviewProps } from '../../ReviewComponents/Review/Review'
import { IProps as QnaProps } from '../../QnaComponents/Qna/Qna'

jest.mock('../Post/Post', () => (props: PostProps) => (
	<div data-testid='spyPost'>
		<button className='post-container' onClick={props.clickDetail}>
			<div>
				{props.title}
				<br />
				동물: {props.animal_type}
				<br />
				품종: {props.species} <br />
				나이: {props.age} <br />
				성별:{props.gender} <br />
				작성자: {props.author}
			</div>
		</button>
	</div>
))

jest.mock(
	'../../ReviewComponents/Review/Review',
	() => (props: ReviewProps) =>
		(
			<div data-testid='spyReview'>
				<div>
					{props.title}
					<br />
					작성자: {props.author}
				</div>
			</div>
		)
)

const fakepost: postListType = {
	id: 1,
	author_name: 'POST_AUTHOR',
	title: 'POST_TITLE_1',
	animal_type: 'POST_ANIMAL_TYPE',
	thumbnail: '',
	species: 'POST_SPECIES',
	age: 1,
	gender: true
}
const fakeReview: reviewListType = {
	id: 1,
	author_id: 1,
	author_name: 'POST_AUTHOR',
	title: 'POST_TITLE_1',
	animal_type: 'POST_ANIMAL_TYPE',
	thumbnail: '',
	species: '',
	created_at: '',
	post_id: 1
}
const fakeQna: QnaType = {
	id: 1,
	author_id: 1,
	author_name: 'POST_AUTHOR',
	title: 'POST_TITLE_1',
	content: 'POST_CONTENT',
	created_at: '',
	hits: 3,
	comments: [],
	editable: true
}

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	// user: { users: [], currentUser: null, logged_in: false },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: {
		posts: [fakepost],
		likes: [fakepost],
		applys: [fakepost],
		reviews: [fakeReview],
		qnas: [fakeQna]
	}
})

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))
const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<MyPost />', () => {
	let mypost: JSX.Element
	beforeEach(() => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: [
				[
					fakepost,
					{ ...fakepost, id: 2 },
					{ ...fakepost, id: 3 },
					{ ...fakepost, id: 4 },
					{ ...fakepost, id: 5 }
				],
				[
					{ ...fakepost, id: 6 },
					{ ...fakepost, id: 7 },
					{ ...fakepost, id: 8 },
					{ ...fakepost, id: 9 },
					{ ...fakepost, id: 10 }
				],
				[
					{ ...fakepost, id: 11 },
					{ ...fakepost, id: 12 },
					{ ...fakepost, id: 13 },
					{ ...fakepost, id: 14 },
					{ ...fakepost, id: 15 }
				],
				[
					{ ...fakeReview, id: 16 },
					{ ...fakeReview, id: 17 },
					{ ...fakeReview, id: 18 },
					{ ...fakeReview, id: 19 },
					{ ...fakeReview, id: 20 }
				],
				[
					{ ...fakeQna, id: 21 },
					{ ...fakeQna, id: 22 },
					{ ...fakeQna, id: 23 },
					{ ...fakeQna, id: 24 },
					{ ...fakeQna, id: 25 }
				]
			]
		})
		Object.defineProperty(global.window, 'scrollTo', { value: scrollToSpy })
		jest.clearAllMocks()
		mypost = (
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route path='/' element={<MyPost />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render posts', async () => {
		await act(() => {
			const { container } = render(mypost)
			expect(container).toBeTruthy()
		})
	})
	it('should render post, like, apply', async () => {
		await act(() => {
			render(mypost)
		})
		screen.getByText('관심 게시글')
		screen.getByText('입양 신청 게시글')
		let posts = screen.getAllByTestId('spyPost')
		expect(posts).toHaveLength(12)
		const postShowMore = document.querySelectorAll('.showMore')
		let ShowMoreButton = postShowMore[0].querySelector('button')
		fireEvent.click(ShowMoreButton!)
		posts = screen.getAllByTestId('spyPost')
		expect(posts).toHaveLength(13)

		ShowMoreButton = postShowMore[1].querySelector('button')
		fireEvent.click(ShowMoreButton!)
		posts = screen.getAllByTestId('spyPost')
		expect(posts).toHaveLength(14)

		ShowMoreButton = postShowMore[2].querySelector('button')
		fireEvent.click(ShowMoreButton!)
		posts = screen.getAllByTestId('spyPost')
		expect(posts).toHaveLength(15)

		let reviews = screen.getAllByTestId('spyReview')
		expect(reviews).toHaveLength(4)
		ShowMoreButton = postShowMore[3].querySelector('button')
		fireEvent.click(ShowMoreButton!)
		reviews = screen.getAllByTestId('spyReview')
		expect(reviews).toHaveLength(5)

		let tableRowElement = document.getElementsByTagName('tr')
		expect(tableRowElement).toHaveLength(5)
		ShowMoreButton = postShowMore[4].querySelector('button')
		fireEvent.click(ShowMoreButton!)
		tableRowElement = document.getElementsByTagName('tr')
		expect(tableRowElement).toHaveLength(6)
	})
	it('should handle clickDetail', async () => {
		await act(() => {
			render(mypost)
		})
		const posts = screen.getAllByTestId('spyPost')
		let post = posts[0]
		let button = post.querySelector('.post-container')
		fireEvent.click(button!)
		expect(mockNavigate).toHaveBeenCalledTimes(1)

		post = posts[5]
		button = post.querySelector('.post-container')
		fireEvent.click(button!)
		expect(mockNavigate).toHaveBeenCalledTimes(2)

		post = posts[10]
		button = post.querySelector('.post-container')
		fireEvent.click(button!)
		expect(mockNavigate).toHaveBeenCalledTimes(3)

		const reviews = document.querySelector('.reviews')
		const reviewButtons = reviews!.querySelectorAll('button')
		fireEvent.click(reviewButtons[0])
		document.querySelector('.Modal')

		const tableRowElement = document.getElementsByTagName('tr')
		const firstRow = tableRowElement[1]
		const titleButton = firstRow.querySelectorAll('#qna-click')
		expect(titleButton).toHaveLength(3)
		fireEvent.click(titleButton[0]!)
		expect(mockNavigate).toHaveBeenCalledTimes(4)
		fireEvent.click(titleButton[1]!)
		expect(mockNavigate).toHaveBeenCalledTimes(5)
		fireEvent.click(titleButton[2]!)
		expect(mockNavigate).toHaveBeenCalledTimes(6)
	})
})
