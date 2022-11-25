/* eslint-disable react/display-name */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import axios from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import * as postSlice from '../../../store/slices/post'
import { getMockStore } from '../../../test-utils/mock'
import PostList from './PostList'
import { IProps as PostProps } from '../Post/Post'
import assert from 'assert'
import { act } from 'react-dom/test-utils'

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

const stubInitialState: postSlice.postState = {
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
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [] }
})

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))
const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<PostList />', () => {
	let postList: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				count: 1,
				results: [
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
				]
			}
		})
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
		await act(() => {
			const { container } = render(postList)
			expect(container).toBeTruthy()
		})
	})
	it('should render posts', async () => {
		await act(() => {
			render(postList)
		})
		const posts = screen.getAllByTestId('spyPost')
		expect(posts).toHaveLength(1)
	})
	it('should handle clickDetail', async () => {
		await act(() => {
			render(postList)
		})
		const posts = screen.getAllByTestId('spyPost')
		const post = posts[0]
		const button = post.querySelector('.post-container')
		assert(button !== null)
		fireEvent.click(button)
		expect(mockNavigate).toHaveBeenCalledTimes(1)
	})
	it('should handle createPostButton', async () => {
		await act(() => {
			render(postList)
		})
		const createPostButton = document.querySelector('#create-post-button')
		assert(createPostButton !== null)
		fireEvent.click(createPostButton)
		expect(mockNavigate).toHaveBeenCalledTimes(1)
	})
	it('should render PostList with corresponding search queries', async () => {
		const mockGetPosts = jest.spyOn(postSlice, 'getPosts')
		const { container } = render(postList)
		await act(async () => {
			const animalTypeInput = await screen.findByLabelText('동물')
			fireEvent.change(animalTypeInput, {
				target: { value: 'ANIMAL_TYPE_TEST' }
			})
		})
		await act(async () => {
			const minDateInput = await container.querySelector(
				'input[name="min-date"]'
			)
			if (minDateInput !== null)
				fireEvent.change(minDateInput, {
					target: { value: 3 }
				})
		})
		await act(async () => {
			const maxDateInput = await container.querySelector(
				'input[name="max-date"]'
			)
			if (maxDateInput !== null)
				fireEvent.change(maxDateInput, {
					target: { value: 5 }
				})
		})
		await act(async () => {
			const minAgeInput = await container.querySelector(
				'input[name="min-age"]'
			)
			if (minAgeInput !== null)
				fireEvent.change(minAgeInput, {
					target: { value: 3 }
				})
		})
		await act(async () => {
			const maxAgeInput = await container.querySelector(
				'input[name="max-age"]'
			)
			if (maxAgeInput !== null)
				fireEvent.change(maxAgeInput, {
					target: { value: 5 }
				})
		})
		await act(async () => {
			const genderInput = await screen.findByLabelText('성별')
			fireEvent.change(genderInput, {
				target: { value: '암컷' }
			})
		})
		await act(async () => {
			const searchButton = await screen.findByRole('button', {
				name: /search-button/i
			})
			fireEvent.click(searchButton)
			await waitFor(() => {
				expect(mockGetPosts).toHaveBeenCalledWith({
					page: 1,
					animal_type: 'ANIMAL_TYPE_TEST',
					date: null,
					date_min: 3,
					date_max: 5,
					age: null,
					age_min: 3,
					age_max: 5,
					species: null,
					gender: false,
					is_active: false
				})
			})
		})
	})
	// it('should render PostList with species and active query', async () => {
	// 	const mockGetPosts = jest.spyOn(postSlice, 'getPosts')
	// 	render(postList)
	// 	// const dogButton = await screen.findByText('개')
	// 	// fireEvent.click(dogButton)
	// 	// const speciesInput = await screen.findByLabelText('종')
	// 	// fireEvent.change(speciesInput, {
	// 	// 	target: { value: 'SPECIES_TEST' }
	// 	// })
	// 	const activeButton = await screen.findByRole('button', {
	// 		name: /active-check-button/i
	// 	})
	// 	fireEvent.click(activeButton)
	// 	// const searchButton = await screen.findByRole('button', {
	// 	// 	name: /search-button/i
	// 	// })
	// 	// fireEvent.click(searchButton)
	// 	await waitFor(() => {
	// 		expect(mockGetPosts).toHaveBeenCalledWith({
	// 			page: 1,
	// 			animal_type: null,
	// 			date: null,
	// 			date_min: null,
	// 			date_max: null,
	// 			age: null,
	// 			age_min: null,
	// 			age_max: null,
	// 			species: null,
	// 			gender: null,
	// 			is_active: true
	// 		})
	// 	})
	// })
})
