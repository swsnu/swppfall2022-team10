/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getMockStore } from '../../../test-utils/mock'
import axios from 'axios'
import MyPage from './MyPage'
import { Provider } from 'react-redux'
import basicProfileImage from '../../../data/basic_profile_image.png'
import { act } from 'react-dom/test-utils'

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

describe('<MyPage />', () => {
	let myPage: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		myPage = (
			<Provider store={mockStore}>
				<MyPage />
			</Provider>
		)
	})
	it('should render without errors', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: { logged_in: false }
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('아이디:')
			screen.getByText('이메일:')
		})
	})
	it('should navigate to login page when not logged in', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: { logged_in: false }
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
	})
	it('should show user info', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
	})
	it('should show edit user info', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)
		await screen.findByText('바꾸기')
	})
	it('should delete user', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
			jest.spyOn(axios, 'delete').mockResolvedValue({})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const deleteButton = await screen.findByText('회원 탈퇴')
		fireEvent.click(deleteButton)
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/')
		})
	})
	it('should go back to show user info ', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)
		const backButton = await screen.findByText('돌아가기')
		fireEvent.click(backButton)
		await waitFor(() => {
			expect(screen.queryByText('바꾸기')).not.toBeInTheDocument()
		})
	})
	it('should handle edit user: submit button clicked', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
			jest.spyOn(axios, 'post').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)

		const submitButton = await screen.findByText('수정하기')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(screen.queryByText('바꾸기')).not.toBeInTheDocument()
		})
	})
	it('should handle edit user: empty password confirm', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
			jest.spyOn(axios, 'post').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)

		const passwordInput = await screen.findByLabelText('새 비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD_1' }
		})

		const submitButton = await screen.findByText('수정하기')
		fireEvent.click(submitButton)

		await screen.findByText('비밀번호를 다시 한 번 입력해주세요.')
	})
	it('should handle edit user: not match password confirm', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
			jest.spyOn(axios, 'post').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)

		const passwordInput = await screen.findByLabelText('새 비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD_1' }
		})

		const passwordConfirmInput = await screen.findByLabelText(
			'비밀번호 확인'
		)
		fireEvent.change(passwordConfirmInput, {
			target: { value: 'TEST_PASSWORD_2' }
		})

		const submitButton = await screen.findByText('수정하기')
		fireEvent.click(submitButton)

		await screen.findByText('비밀번호가 일치하지 않습니다.')
	})
	it('should handle edit user: not match password condition', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
			jest.spyOn(axios, 'post').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)

		const passwordInput = await screen.findByLabelText('새 비밀번호')
		fireEvent.change(passwordInput, {
			target: { value: 'TEST_PASSWORD' }
		})

		const passwordConfirmInput = await screen.findByLabelText(
			'비밀번호 확인'
		)
		fireEvent.change(passwordConfirmInput, {
			target: { value: 'TEST_PASSWORD' }
		})

		const submitButton = await screen.findByText('수정하기')
		fireEvent.click(submitButton)

		await screen.findByText('비밀번호를 다시 입력해주세요.')
	})
	it('should handle edit user: not match password condition', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
			jest.spyOn(axios, 'post').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		await act(() => {
			render(myPage)
		})
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)

		const emailInput = await screen.findByLabelText('이메일')
		fireEvent.change(emailInput, { target: { value: 'TEST_EMAIL_1' } })

		await waitFor(() => {
			expect(emailInput).toHaveValue('TEST_EMAIL_1')
		})
	})
	it('should handle edit user: file upload', async () => {
		await act(() => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: { logged_in: false }
			})
			jest.spyOn(axios, 'get').mockResolvedValue({
				data: {
					username: 'TEST_USERNAME',
					email: 'TEST_EMAIL',
					photo_path: null
				}
			})
		})
		const { container } = render(myPage)
		await waitFor(() => {
			screen.getByText('TEST_USERNAME')
			screen.getByText('TEST_EMAIL')
			const profileImage = document.querySelector(
				'img'
			) as HTMLImageElement
			expect(profileImage.src).toContain(basicProfileImage)
		})
		const editButton = await screen.findByText('회원정보 수정')
		fireEvent.click(editButton)

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
})
