/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../../test-utils/mock'
import axios from 'axios'
import Signup from './Signup'
import { Provider } from 'react-redux'
import basicProfileImage from '../../../data/basic_profile_image.png'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockNavigate
}))

const mockStore = getMockStore({
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	qna: { qnas: [], selectedQna: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../../Header/Header', () => () => 'Header')
jest.mock('../../Footer/Footer', () => () => 'Footer')
jest.mock('../../Layout/ScrollToTop', () => () => '')

describe('<Signup />', () => {
	let signUp: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		signUp = (
			<Provider store={mockStore}>
				<Signup />
			</Provider>
		)
	})
	it('should render without errors', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: false }
		})
		render(signUp)
		await waitFor(() => {
			expect(screen.getAllByText('회원가입')).toHaveLength(2)
			screen.getByText('아이디')
			screen.getByText('비밀번호')
		})
	})
	it('should navigate to main page when already logged in', async () => {
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { logged_in: true }
		})
		render(signUp)
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
	})
	it('should check not duplicated username', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: true }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const button = await screen.findByText('중복확인')
		fireEvent.click(button)

		await screen.findByText('이용 가능한 아이디입니다.')
	})
	it('should check duplicated username', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: false }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const button = await screen.findByText('중복확인')
		fireEvent.click(button)

		await screen.findByText('중복된 아이디입니다.')
	})
	it('should check empty username', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})

		render(signUp)

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await screen.findByText('아이디를 입력해주세요.')
	})
	it('should check if duplicate username checked 1', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})

		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await screen.findByText('아이디 중복확인을 해주세요.')
	})
	it('should check if duplicate username checked 2', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})

		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: false }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const duplicateButton = await screen.findByText('중복확인')
		fireEvent.click(duplicateButton)

		await screen.findByText('중복된 아이디입니다.')

		const signupButton = screen.getAllByText('회원가입')[1]
		fireEvent.click(signupButton)

		await screen.findByText('다른 아이디를 입력해주세요.')
	})
	it('should check empty password', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: true }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const duplicateButton = await screen.findByText('중복확인')
		fireEvent.click(duplicateButton)

		await screen.findByText('이용 가능한 아이디입니다.')

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await screen.findByText('비밀번호를 입력해주세요.')
	})
	it('should check empty password confirm', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: true }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const duplicateButton = await screen.findByText('중복확인')
		fireEvent.click(duplicateButton)

		await screen.findByText('이용 가능한 아이디입니다.')

		const passwordInput = await screen.findByLabelText('비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD_1' }
		})

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await screen.findByText('비밀번호를 다시 한 번 입력해주세요.')
	})
	it('should check not matched password', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: true }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const duplicateButton = await screen.findByText('중복확인')
		fireEvent.click(duplicateButton)

		await screen.findByText('이용 가능한 아이디입니다.')

		const passwordInput = await screen.findByLabelText('비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD_1' }
		})

		const passwordConfirmInput = await screen.findByLabelText(
			'비밀번호 확인'
		)
		fireEvent.change(passwordConfirmInput, {
			target: { value: 'TEST_PASSWORD_2' }
		})

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await screen.findByText('비밀번호가 일치하지 않습니다.')
	})
	it('should check password condition', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: { confirm: true }
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const duplicateButton = await screen.findByText('중복확인')
		fireEvent.click(duplicateButton)

		await screen.findByText('이용 가능한 아이디입니다.')

		const passwordInput = await screen.findByLabelText('비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD' }
		})

		const passwordConfirmInput = await screen.findByLabelText(
			'비밀번호 확인'
		)
		fireEvent.change(passwordConfirmInput, {
			target: { value: 'TEST_PASSWORD' }
		})

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await screen.findByText('비밀번호를 다시 입력해주세요.')
	})
	it('should handle signup', async () => {
		// checkLogin
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})
		// checkUsername
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { confirm: true }
		})
		// signupUser
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: true
		})
		jest.spyOn(axios, 'post').mockResolvedValueOnce({
			data: true
		})
		render(signUp)

		const usernameInput = await screen.findByLabelText('아이디')
		fireEvent.change(usernameInput, { target: { value: 'TEST_USERNAME' } })

		const duplicateButton = await screen.findByText('중복확인')
		fireEvent.click(duplicateButton)

		await screen.findByText('이용 가능한 아이디입니다.')

		const passwordInput = await screen.findByLabelText('비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD_1' }
		})

		const passwordConfirmInput = await screen.findByLabelText(
			'비밀번호 확인'
		)
		fireEvent.change(passwordConfirmInput, {
			target: { value: 'TEST_PASSWORD_1' }
		})

		const button = screen.getAllByText('회원가입')[1]
		fireEvent.click(button)

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/login')
		})
	})
	it('should handle basic profile image before file upload', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})
		render(signUp)

		const profileImage = document.querySelector('img') as HTMLImageElement
		expect(profileImage.src).toContain(basicProfileImage)
	})
	it('should handle file upload', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: true }
		})

		const { container } = render(signUp)

		const readAsDataURL = jest
			.spyOn(FileReader.prototype, 'readAsDataURL')
			.mockImplementation(() => null)

		const file: Partial<File> = {
			name: 'myimage.png',
			lastModified: 1580400631732,
			size: 703786,
			type: 'image/png'
		}
		const fileInput = container.querySelector('input[name="photo"]')
		if (fileInput !== null) {
			fireEvent.change(fileInput, { target: { files: [file] } })
		}

		expect(readAsDataURL).toBeCalledWith(file)
	})
	it('should handle email input', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: { logged_in: false }
		})

		render(signUp)

		const emailInput = await screen.findByLabelText('이메일')
		fireEvent.change(emailInput, { target: { value: 'TEST_EMAIL' } })

		await waitFor(() => {
			expect(emailInput).toHaveValue('TEST_EMAIL')
		})
	})
})
