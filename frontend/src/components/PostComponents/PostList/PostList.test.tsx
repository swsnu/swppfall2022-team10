/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { postState } from '../../../store/slices/post'
import { getMockStore } from '../../../test-utils/mock'
import PostList from './PostList'
import { IProps as PostProps } from '../Post/Post'
import assert from 'assert'

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

const stubInitialState: postState = {
	posts: [
		{
			id: 1,
			author_id: 1,
			author_name: 'POST_AUTHOR',
			name: 'POST_NAME',
			vaccination: true,
			neutering: true,
			title: 'POST_TITLE_1',
			animal_type: 'POST_ANIMAL_TYPE',
			photo_path: [],
			species: 'POST_SPECIES',
			age: 1,
			gender: true,
			content: 'POST_CONTENT',
			created_at: 'POST_CREATED_AT',
			is_active: true,
			editable: false
		}
	],
	selectedPost: null,
	selectedAnimal: ''
}
const mockStore = getMockStore({
	post: stubInitialState,
	user: { users: [], currentUser: null, logged_in: false },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' }
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

describe('<PostList />', () => {
	let postList: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		postList = (
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route path='/' element={<PostList />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render PostList', async () => {
		const { container } = render(postList)
		expect(container).toBeTruthy()
	})
	it('should render posts', () => {
		render(postList)
		const posts = screen.getAllByTestId('spyPost')
		expect(posts).toHaveLength(1)
	})
	it('should handle clickDetail', () => {
		render(postList)
		const posts = screen.getAllByTestId('spyPost')
		const post = posts[0]
		const button = post.querySelector('.post-container')
		assert(button !== null)
		fireEvent.click(button)
		expect(mockNavigate).toHaveBeenCalledTimes(1)
	})
	it('should handle createPostButton', () => {
		render(postList)
		const createPostButton = document.querySelector('#create-post-button')
		assert(createPostButton !== null)
		fireEvent.click(createPostButton)
		expect(mockNavigate).toHaveBeenCalledTimes(1)
	})
})
