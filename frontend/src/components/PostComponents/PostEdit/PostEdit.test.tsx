/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import PostEdit from './PostEdit'
import { getMockStore } from '../../../test-utils/mock'
import { Provider } from 'react-redux'
import { act } from 'react-dom/test-utils'

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
	mypost: { posts: [], likes: [], applys: [] },
	comment: { comments: [], selectedComment: null },
}

const testPostFormat = {
	id: 1,
	author_id: 1,
	name: 'POST_TEST_NAME',
	title: 'POST_TEST_TITLE',
	animal_type: 'POST_TEST_ANIMAL_TYPE',
	species: 'POST_TEST_SPECIES',
	age: 5,
	content: 'POST_TEST_CONTENT',
	gender: true,
	vaccination: true,
	neutering: true,
	photo_path: []
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

describe('<PostEdit />', () => {
	let postEdit: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		postEdit = (
			<Provider store={getMockStore(tempState)}>
				<MemoryRouter>
					<Routes>
						<Route path='/post/1/edit' element={<PostEdit />} />
						<Route
							path='/'
							element={<Navigate to={'/post/1/edit'} />}
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
		jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: testPostFormat })
		await act(() => {
			render(postEdit)
		})
		await screen.findByText('입양게시글 수정하기')
	})
	it('should navigate to login page when not logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		await act(() => {
			render(postEdit)
		})
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/login')
		})
	})
	it('should render button and inputs', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: testPostFormat })
		await act(() => {
			render(postEdit)
		})
		const titleInput = await screen.findByLabelText('제목:')
		const nameInput = await screen.findByLabelText('이름:')

		await waitFor(() => {
			expect(titleInput).toHaveValue('POST_TEST_TITLE')
			expect(nameInput).toHaveValue('POST_TEST_NAME')
		})
	})
	it('should render navigate to /post/:id when submitted', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: testPostFormat })
		jest.spyOn(axios, 'post').mockResolvedValueOnce({
			data: testPostFormat
		})
		const { container } = render(postEdit)

		await act(async () => {
			const titleInput = await screen.findByLabelText('제목:')
			fireEvent.change(titleInput, {
				target: { value: 'POST_TEST_TITLE_NEW' }
			})
		})

		await act(async () => {
			const nameInput = await screen.findByLabelText('이름:')
			fireEvent.change(nameInput, {
				target: { value: 'POST_TEST_NAME_NEW' }
			})
		})

		await act(async () => {
			const animalTypeInput = await screen.findByLabelText('동물:')
			fireEvent.change(animalTypeInput, {
				target: { value: 'POST_TEST_ANIMAL_TYPE_NEW' }
			})
		})

		await act(async () => {
			const speciesInput = await screen.findByLabelText('종:')
			fireEvent.change(speciesInput, {
				target: { value: 'POST_TEST_SPECIES_NEW' }
			})
		})

		await act(async () => {
			const ageInput = await screen.findByLabelText('나이:')
			fireEvent.change(ageInput, { target: { value: '6' } })
		})

		await act(async () => {
			const genderInput = container.querySelector('input[name="gender"]')
			if (genderInput !== null)
				fireEvent.change(genderInput, { target: { value: '수컷' } })
		})

		await act(async () => {
			const vaccinationInput = container.querySelector(
				'input[name="vaccination"]'
			)
			if (vaccinationInput !== null)
				fireEvent.change(vaccinationInput, { target: { value: 'X' } })
		})

		await act(async () => {
			const neuteringInput = container.querySelector(
				'input[name="neutering"]'
			)
			if (neuteringInput !== null)
				fireEvent.change(neuteringInput, { target: { value: 'X' } })
		})

		await act(async () => {
			const contentInput = await screen.findByLabelText(
				'동물에 대해 추가로 알려주세요! 자세한 설명은 입양에 도움이 됩니다:)'
			)
			fireEvent.change(contentInput, {
				target: { value: 'POST_TEST_CONTENT_NEW' }
			})
		})

		await act(async () => {
			const file: Partial<File> = {
				name: 'myimage_new.png',
				lastModified: 1580400631732,
				size: 703786,
				type: 'image/png'
			}
			const fileInput = container.querySelector('input[name="photo"]')
			if (fileInput !== null)
				fireEvent.change(fileInput, { target: { files: [file] } })
		})

		await act(async () => {
			const postButton = await screen.findByText('수정하기')
			fireEvent.click(postButton)
			await waitFor(() =>
				expect(mockNavigate).toHaveBeenCalledWith('/post/1')
			)
		})
	})
	it('should render navigate to / when back Button clicked', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: testPostFormat })
		await act(() => {
			render(postEdit)
		})
		const backButton = await screen.findByRole('button', {
			name: /back-button/i
		})
		fireEvent.click(backButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
})
