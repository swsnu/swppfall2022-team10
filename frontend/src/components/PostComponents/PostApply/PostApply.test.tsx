/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import PostApply from './PostApply'
import { getMockStore } from '../../../test-utils/mock'
import { Provider } from 'react-redux'

const tempState = {
	post: {
		posts: [],
		selectedPost: null,
		selectedAnimal: ''
	},
	// user: { users: [], currentUser: null, logged_in: true },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
}

const testApplicationFormat = {
	id: 1,
	author_id: 1,
	author_name: 'jhpyun1',
	file: '',
	created_at: '2022-06-22',
	post_id: 1
}

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../../Header/Header', () => () => 'Header')
jest.mock('../../Footer/Footer', () => () => 'Footer')
jest.mock('../../Layout/ScrollToTop', () => () => '')
jest.mock('../PostHeader/PostHeader', () => () => '')

describe('<PostApply />', () => {
	let postApply: JSX.Element
	// let postCreateLoggedOut: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		postApply = (
			<Provider store={getMockStore(tempState)}>
				<MemoryRouter>
					<Routes>
						<Route path='/post/:id/apply' element={<PostApply />} />
						<Route
							path='/'
							element={<Navigate to={'/post/1/apply'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		render(postApply)
		await screen.findByText('입양 신청서 제출하기')
		await screen.findByText(/신청서:/)
		await screen.findByText('보내기')
	})
	// it('should alert error when post failed', async () => {
	// 	jest.spyOn(axios, 'get').mockResolvedValueOnce({
	// 		data: { logged_in: true }
	// 	})
	// 	jest.spyOn(axios, 'post').mockRejectedValueOnce({})
	// 	window.alert = jest.fn()
	//
	// 	const { container } = render(postApply)
	//
	// 	const file: Partial<File> = {
	// 		name: 'myimage.png',
	// 		lastModified: 1580400631732,
	// 		size: 703786,
	// 		type: 'image/png'
	// 	}
	// 	const fileInput = container.querySelector('input[name="photo"]')
	// 	if (fileInput !== null)
	// 		fireEvent.change(fileInput, { target: { files: [file] } })
	//
	// 	const postButton = await screen.findByText('보내기')
	// 	fireEvent.click(postButton)
	// 	await waitFor(() => expect(window.alert).toHaveBeenCalledWith('ERROR'))
	// })
	// it('should not handle create post if not logged in', async () => {
	// 	window.alert = jest.fn()
	//
	// 	jest.spyOn(axios, 'get').mockResolvedValueOnce({
	// 		data: { logged_in: false }
	// 	})
	// 	const { container } = render(postApply)
	//
	// 	await waitFor(() =>
	// 		expect(window.alert).toHaveBeenCalledWith('You should log in')
	// 	)
	// })
	// it('should not handle create post if empty field exists', async () => {
	// 	jest.spyOn(axios, 'get').mockResolvedValueOnce({
	// 		data: { logged_in: true }
	// 	})
	// 	window.alert = jest.fn()
	//
	// 	const { container } = render(postApply)
	//
	// 	const postButton = await screen.findByText('보내기')
	// 	fireEvent.click(postButton)
	// 	await waitFor(() => expect(axios.post).not.toHaveBeenCalled())
	// })
	// it('should not handle create post if no photo file', async () => {
	// 	jest.spyOn(axios, 'get').mockResolvedValueOnce({
	// 		data: { logged_in: true }
	// 	})
	// 	window.alert = jest.fn()
	//
	// 	const { container } = render(postApply)
	// 	const postButton = await screen.findByText('보내기')
	// 	fireEvent.click(postButton)
	// 	await waitFor(() => expect(axios.post).not.toHaveBeenCalled())
	// })

	// it('should render navigate to /post/:id when submitted', async () => {
	// 	jest.spyOn(axios, 'get').mockResolvedValueOnce({
	// 		data: { logged_in: true }
	// 	})
	// 	jest.spyOn(axios, 'post').mockResolvedValueOnce({
	// 		data: { file: "" }
	// 	})
	// 	const { container } = render(postApply)
	//
	// 	const file: Partial<File> = {
	// 		name: 'myimage.png',
	// 		lastModified: 1580400631732,
	// 		size: 703786,
	// 		type: 'image/png'
	// 	}
	// 	const fileInput = container.querySelector('input[name="photo"]')
	// 	if (fileInput !== null)
	// 		fireEvent.change(fileInput, { target: { files: [file] } })
	//
	//
	// 	const postButton = await screen.findByText('보내기')
	// 	fireEvent.click(postButton)
	// 	await waitFor(() =>
	// 		expect(mockNavigate).toHaveBeenCalledWith('/post/1')
	// 	)
	// })
})
