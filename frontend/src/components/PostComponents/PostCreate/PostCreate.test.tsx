/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import PostCreate from './PostCreate'
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

// const tempLoggedOutState = {
// 	post: {
// 		posts: [],
// 		selectedPost: null,
// 		selectedAnimal: ''
// 	},
// 	user: { users: [], currentUser: null, logged_in: false },
// 	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
// 	application: { applications: [], selectedApplication: null },
// 	qna: { qnas: [], selectedQna: null },
// 	mypost: { posts: [], likes: [], applys: [] }
// }

const testPostFormat = {
	id: 1,
	author_id: 1,
	name: 'POST_TEST_NAME',
	title: 'POST_TEST_TITLE',
	animal_type: 'POST_TEST_ANIMAL_TYPE',
	species: 'POST_TEST_SPECIES',
	age: 0,
	content: 'POST_TEST_CONTENT',
	gender: true,
	vaccination: true,
	neutering: true
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

describe('<PostCreate />', () => {
	let postCreate: JSX.Element
	// let postCreateLoggedOut: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		postCreate = (
			<Provider store={getMockStore(tempState)}>
				<MemoryRouter>
					<Routes>
						<Route path='/post/create' element={<PostCreate />} />
						<Route
							path='/'
							element={<Navigate to={'/post/create'} />}
						/>
					</Routes>
				</MemoryRouter>
			</Provider>
		)
		// postCreateLoggedOut = (
		// 	<Provider store={getMockStore(tempLoggedOutState)}>
		// 		<MemoryRouter>
		// 			<Routes>
		// 				<Route path='/post/create' element={<PostCreate />} />
		// 				<Route
		// 					path='/'
		// 					element={<Navigate to={'/post/create'} />}
		// 				/>
		// 			</Routes>
		// 		</MemoryRouter>
		// 	</Provider>
		// )
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		render(postCreate)
		await screen.findByText('??????????????? ?????????')
	})
	it('should render button and inputs', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		const { container } = render(postCreate)
		const titleInput = await screen.findByLabelText('??????:')
		fireEvent.change(titleInput, { target: { value: 'POST_TEST_TITLE' } })

		const nameInput = await screen.findByLabelText('??????:')
		fireEvent.change(nameInput, { target: { value: 'POST_TEST_NAME' } })

		const animalTypeInput = await screen.findByLabelText('??????:')
		fireEvent.change(animalTypeInput, {
			target: { value: 'POST_TEST_ANIMAL_TYPE' }
		})

		const speciesInput = await screen.findByLabelText('???:')
		fireEvent.change(speciesInput, {
			target: { value: 'POST_TEST_SPECIES' }
		})

		const ageInput = await container.querySelector('input[name="age"]')
		if (ageInput !== null)
			fireEvent.change(ageInput, { target: { value: 5 } })

		await waitFor(() => {
			expect(titleInput).toHaveValue('POST_TEST_TITLE')
			expect(nameInput).toHaveValue('POST_TEST_NAME')
		})
	})
	it('should render navigate to /post/:id when submitted', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'post').mockResolvedValueOnce({
			data: testPostFormat
		})
		const { container } = render(postCreate)
		const titleInput = await screen.findByLabelText('??????:')
		fireEvent.change(titleInput, { target: { value: 'POST_TEST_TITLE' } })

		const nameInput = await screen.findByLabelText('??????:')
		fireEvent.change(nameInput, { target: { value: 'POST_TEST_NAME' } })

		const animalTypeInput = await screen.findByLabelText('??????:')
		fireEvent.change(animalTypeInput, {
			target: { value: 'POST_TEST_ANIMAL_TYPE' }
		})

		const speciesInput = await screen.findByLabelText('???:')
		fireEvent.change(speciesInput, {
			target: { value: 'POST_TEST_SPECIES' }
		})

		const ageInput = await container.querySelector('input[name="age"]')
		if (ageInput !== null)
			fireEvent.change(ageInput, { target: { value: 5 } })

		const genderInput = container.querySelector('input[name="gender"]')
		if (genderInput !== null)
			fireEvent.change(genderInput, { target: { value: '??????' } })

		const vaccinationInput = container.querySelector(
			'input[name="vaccination"]'
		)
		if (vaccinationInput !== null)
			fireEvent.change(vaccinationInput, { target: { value: 'O' } })

		const neuteringInput = container.querySelector(
			'input[name="neutering"]'
		)
		if (neuteringInput !== null)
			fireEvent.change(neuteringInput, { target: { value: 'O' } })

		const contentInput = await screen.findByLabelText(
			'????????? ?????? ????????? ???????????????! ????????? ????????? ????????? ????????? ?????????:)'
		)
		fireEvent.change(contentInput, {
			target: { value: 'POST_TEST_CONTENT' }
		})

		const file: Partial<File> = {
			name: 'myimage.png',
			lastModified: 1580400631732,
			size: 703786,
			type: 'image/png'
		}
		const fileInput = container.querySelector('input[name="photo"]')
		if (fileInput !== null)
			fireEvent.change(fileInput, { target: { files: [file] } })

		const applyForm: Partial<File> = {
			name: 'myimage.doc',
			lastModified: 1580400631732,
			size: 703786,
			type: 'text/doc'
		}
		const applyFormInput = container.querySelector(
			'input[name="application"]'
		)
		if (applyFormInput !== null)
			fireEvent.change(applyFormInput, { target: { files: [applyForm] } })

		const postButton = await screen.findByText('????????????')
		fireEvent.click(postButton)
		await waitFor(() =>
			expect(mockNavigate).toHaveBeenCalledWith('/post/1')
		)
	})
	it('should alert error when post failed', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		jest.spyOn(axios, 'post').mockRejectedValueOnce({})
		window.alert = jest.fn()

		const { container } = render(postCreate)
		const titleInput = await screen.findByLabelText('??????:')
		fireEvent.change(titleInput, { target: { value: 'POST_TEST_TITLE' } })

		const nameInput = await screen.findByLabelText('??????:')
		fireEvent.change(nameInput, { target: { value: 'POST_TEST_NAME' } })

		const animalTypeInput = await screen.findByLabelText('??????:')
		fireEvent.change(animalTypeInput, {
			target: { value: 'POST_TEST_ANIMAL_TYPE' }
		})

		const speciesInput = await screen.findByLabelText('???:')
		fireEvent.change(speciesInput, {
			target: { value: 'POST_TEST_SPECIES' }
		})

		const ageInput = await container.querySelector('input[name="age"]')
		if (ageInput !== null)
			fireEvent.change(ageInput, { target: { value: 5 } })

		const genderInput = container.querySelector('input[name="gender"]')
		if (genderInput !== null)
			fireEvent.change(genderInput, { target: { value: '??????' } })

		const vaccinationInput = container.querySelector(
			'input[name="vaccination"]'
		)
		if (vaccinationInput !== null)
			fireEvent.change(vaccinationInput, { target: { value: 'O' } })

		const neuteringInput = container.querySelector(
			'input[name="neutering"]'
		)
		if (neuteringInput !== null)
			fireEvent.change(neuteringInput, { target: { value: 'O' } })

		const contentInput = await screen.findByLabelText(
			'????????? ?????? ????????? ???????????????! ????????? ????????? ????????? ????????? ?????????:)'
		)
		fireEvent.change(contentInput, {
			target: { value: 'POST_TEST_CONTENT' }
		})

		const file: Partial<File> = {
			name: 'myimage.png',
			lastModified: 1580400631732,
			size: 703786,
			type: 'image/png'
		}
		const fileInput = container.querySelector('input[name="photo"]')
		if (fileInput !== null)
			fireEvent.change(fileInput, { target: { files: [file] } })

		const applyForm: Partial<File> = {
			name: 'myimage.doc',
			lastModified: 1580400631732,
			size: 703786,
			type: 'text/doc'
		}
		const applyFormInput = container.querySelector(
			'input[name="application"]'
		)
		if (applyFormInput !== null)
			fireEvent.change(applyFormInput, { target: { files: [applyForm] } })

		const postButton = await screen.findByText('????????????')
		fireEvent.click(postButton)
		await waitFor(() => expect(window.alert).toHaveBeenCalledWith('ERROR'))
	})
	it('should not handle create post if not logged in', async () => {
		window.alert = jest.fn()

		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		const { container } = render(postCreate)

		// const { container } = render(postCreateLoggedOut)
		// const postButton = await screen.findByText('????????????')
		// fireEvent.click(postButton)
		await waitFor(() =>
			expect(window.alert).toHaveBeenCalledWith('You should log in')
		)
		// await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
	})
	it('should not handle create post if empty field exists', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		window.alert = jest.fn()

		const { container } = render(postCreate)

		const postButton = await screen.findByText('????????????')
		fireEvent.click(postButton)
		await waitFor(() => expect(axios.post).not.toHaveBeenCalled())
	})
	it('should not handle create post if no photo file', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		window.alert = jest.fn()

		const { container } = render(postCreate)
		const titleInput = await screen.findByLabelText('??????:')
		fireEvent.change(titleInput, { target: { value: 'POST_TEST_TITLE' } })

		const nameInput = await screen.findByLabelText('??????:')
		fireEvent.change(nameInput, { target: { value: 'POST_TEST_NAME' } })

		const animalTypeInput = await screen.findByLabelText('??????:')
		fireEvent.change(animalTypeInput, {
			target: { value: 'POST_TEST_ANIMAL_TYPE' }
		})

		const speciesInput = await screen.findByLabelText('???:')
		fireEvent.change(speciesInput, {
			target: { value: 'POST_TEST_SPECIES' }
		})

		const ageInput = await container.querySelector('input[name="age"]')
		if (ageInput !== null)
			fireEvent.change(ageInput, { target: { value: 5 } })

		const genderInput = container.querySelector('input[name="gender"]')
		if (genderInput !== null)
			fireEvent.change(genderInput, { target: { value: '??????' } })

		const vaccinationInput = container.querySelector(
			'input[name="vaccination"]'
		)
		if (vaccinationInput !== null)
			fireEvent.change(vaccinationInput, { target: { value: 'O' } })

		const neuteringInput = container.querySelector(
			'input[name="neutering"]'
		)
		if (neuteringInput !== null)
			fireEvent.change(neuteringInput, { target: { value: 'O' } })

		const contentInput = await screen.findByLabelText(
			'????????? ?????? ????????? ???????????????! ????????? ????????? ????????? ????????? ?????????:)'
		)
		fireEvent.change(contentInput, {
			target: { value: 'POST_TEST_CONTENT' }
		})

		const postButton = await screen.findByText('????????????')
		fireEvent.click(postButton)
		await waitFor(() => expect(axios.post).not.toHaveBeenCalled())
	})
	it('should not handle create post if no apply form file', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		window.alert = jest.fn()

		const { container } = render(postCreate)
		const titleInput = await screen.findByLabelText('??????:')
		fireEvent.change(titleInput, { target: { value: 'POST_TEST_TITLE' } })

		const nameInput = await screen.findByLabelText('??????:')
		fireEvent.change(nameInput, { target: { value: 'POST_TEST_NAME' } })

		const animalTypeInput = await screen.findByLabelText('??????:')
		fireEvent.change(animalTypeInput, {
			target: { value: 'POST_TEST_ANIMAL_TYPE' }
		})

		const speciesInput = await screen.findByLabelText('???:')
		fireEvent.change(speciesInput, {
			target: { value: 'POST_TEST_SPECIES' }
		})

		const ageInput = await container.querySelector('input[name="age"]')
		if (ageInput !== null)
			fireEvent.change(ageInput, { target: { value: 5 } })

		const genderInput = container.querySelector('input[name="gender"]')
		if (genderInput !== null)
			fireEvent.change(genderInput, { target: { value: '??????' } })

		const vaccinationInput = container.querySelector(
			'input[name="vaccination"]'
		)
		if (vaccinationInput !== null)
			fireEvent.change(vaccinationInput, { target: { value: 'O' } })

		const neuteringInput = container.querySelector(
			'input[name="neutering"]'
		)
		if (neuteringInput !== null)
			fireEvent.change(neuteringInput, { target: { value: 'O' } })

		const contentInput = await screen.findByLabelText(
			'????????? ?????? ????????? ???????????????! ????????? ????????? ????????? ????????? ?????????:)'
		)

		const file: Partial<File> = {
			name: 'myimage.png',
			lastModified: 1580400631732,
			size: 703786,
			type: 'image/png'
		}
		const fileInput = container.querySelector('input[name="photo"]')
		if (fileInput !== null)
			fireEvent.change(fileInput, { target: { files: [file] } })

		fireEvent.change(contentInput, {
			target: { value: 'POST_TEST_CONTENT' }
		})

		const postButton = await screen.findByText('????????????')
		fireEvent.click(postButton)
		await waitFor(() => expect(axios.post).not.toHaveBeenCalled())
	})
	// it('should not handle create post if age not satisfied', async () => {
	// 	jest.spyOn(axios, 'get').mockResolvedValueOnce({
	// 		data: { logged_in: true }
	// 	})
	// 	window.alert = jest.fn()

	// 	const { container } = render(postCreate)
	// 	const titleInput = await screen.findByLabelText('??????:')
	// 	fireEvent.change(titleInput, { target: { value: 'POST_TEST_TITLE' } })

	// 	const nameInput = await screen.findByLabelText('??????:')
	// 	fireEvent.change(nameInput, { target: { value: 'POST_TEST_NAME' } })

	// 	const animalTypeInput = await screen.findByLabelText('??????:')
	// 	fireEvent.change(animalTypeInput, {
	// 		target: { value: 'POST_TEST_ANIMAL_TYPE' }
	// 	})

	// 	const speciesInput = await screen.findByLabelText('???:')
	// 	fireEvent.change(speciesInput, {
	// 		target: { value: 'POST_TEST_SPECIES' }
	// 	})

	// 	const ageInput = await screen.findByLabelText('??????:')
	// 	fireEvent.change(ageInput, { target: { value: '33' } })

	// 	const genderInput = container.querySelector('input[name="gender"]')
	// 	if (genderInput !== null)
	// 		fireEvent.change(genderInput, { target: { value: '??????' } })

	// 	const vaccinationInput = container.querySelector(
	// 		'input[name="vaccination"]'
	// 	)
	// 	if (vaccinationInput !== null)
	// 		fireEvent.change(vaccinationInput, { target: { value: 'O' } })

	// 	const neuteringInput = container.querySelector(
	// 		'input[name="neutering"]'
	// 	)
	// 	if (neuteringInput !== null)
	// 		fireEvent.change(neuteringInput, { target: { value: 'O' } })

	// 	const contentInput = await screen.findByLabelText(
	// 		'????????? ?????? ????????? ???????????????! ????????? ????????? ????????? ????????? ?????????:)'
	// 	)
	// 	fireEvent.change(contentInput, {
	// 		target: { value: 'POST_TEST_CONTENT' }
	// 	})

	// 	const file: Partial<File> = {
	// 		name: 'myimage.png',
	// 		lastModified: 1580400631732,
	// 		size: 703786,
	// 		type: 'image/png'
	// 	}
	// 	const fileInput = container.querySelector('input[name="photo"]')
	// 	if (fileInput !== null)
	// 		fireEvent.change(fileInput, { target: { files: [file] } })

	// 	const applyForm: Partial<File> = {
	// 		name: 'myimage.doc',
	// 		lastModified: 1580400631732,
	// 		size: 703786,
	// 		type: 'text/doc'
	// 	}
	// 	const applyFormInput = container.querySelector(
	// 		'input[name="application"]'
	// 	)
	// 	if (applyFormInput !== null)
	// 		fireEvent.change(applyFormInput, { target: { files: [applyForm] } })

	// 	const postButton = await screen.findByText('????????????')
	// 	fireEvent.click(postButton)
	// 	await waitFor(() => expect(axios.post).not.toHaveBeenCalled())
	// })
	it('should render navigate to / when back Button clicked', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		render(postCreate)
		const backButton = await screen.findByRole('button', {
			name: /back-button/i
		})
		fireEvent.click(backButton)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
})
