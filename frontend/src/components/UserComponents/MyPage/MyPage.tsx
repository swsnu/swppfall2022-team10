/* eslint-disable n/handle-callback-err */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */

import Layout from '../../Layout/Layout'
import basicProfileImage from '../../../data/basic_profile_image.png'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import {
	checkLogin,
	getUser,
	editUser,
	deleteUser,
	UserSignupType,
	UserType
} from '../../../store/slices/user'
import { useNavigate } from 'react-router-dom'
import { MdDone, MdClear } from 'react-icons/md'
import './MyPage.scss'

export default function MyPage() {
	const [currentUser, setCurrentUser] = useState<UserType | null>(null)
	const [edit, setEdit] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
	const [passwordConfirm, setPasswordConfirm] = useState<string>('')
	const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<
		string | null
	>(null)
	const [matchPassword, setMatchPassword] = useState<boolean | null>(null)
	const [email, setEmail] = useState<string>('')
	const [file, setFile] = useState<File>()
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(checkLogin()).then((result) => {
			const loggedIn: boolean = (result.payload as { logged_in: boolean })
				.logged_in
			if (!loggedIn) navigate('/')
		})
		dispatch(getUser()).then((result) => {
			console.log(result.payload)
			setCurrentUser(result.payload)
			setEmail(result.payload.email)
			setImageUrl(result.payload.photo_path)
		})
	}, [])

	useEffect(() => {
		if (password !== passwordConfirm) setMatchPassword(false)
		else setMatchPassword(true)
	}, [password, passwordConfirm])

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader()
		const files = event.target.files
		reader.onloadend = () => {
			setImageUrl(reader.result as string)
		}
		if (files !== null) {
			setFile(Array.from(files)[0])
			reader.readAsDataURL(files[0])
		}
	}

	const changeInfoHandler = async () => {
		setPasswordConfirmMessage(null)
		setPasswordMessage(null)

		if (currentUser === null) return

		if (password !== '' && passwordConfirm === '') {
			setPasswordConfirmMessage('비밀번호를 다시 한 번 입력해주세요.')
			return
		}
		if (matchPassword === false) {
			setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.')
			return
		}

		var pattern1 = /[0-9]/
		var pattern2 = /[a-zA-Z]/
		if (
			password !== '' &&
			(password.length < 10 ||
				!(pattern1.test(password) && pattern2.test(password)))
		) {
			setPasswordMessage('비밀번호를 다시 입력해주세요.')
			return
		}

		const userData: UserSignupType = {
			username: currentUser.username,
			password: password === '' ? null : password,
			email: email
		}

		const formData = new FormData()
		formData.append('content', JSON.stringify(userData))
		if (file !== undefined) formData.append('photos', file)

		dispatch(editUser(formData))
			.then((result) => {
				setCurrentUser(result.payload)
				setEdit(false)
			})
			.catch((err) => {
				// console.log(err)
				alert('Edit User Error')
				setPassword('')
				setPasswordConfirm('')
				setEmail(currentUser.email)
				setPasswordConfirmMessage(null)
				setPasswordMessage(null)
			})
	}
	return (
		<Layout>
			<div className='MyPageContainer'>
				<div className='MyPage'>
					{edit ? (
						<form className='user-info-form'>
							<div className='user-info-input-container'>
								<div className='user-photo'>
									<div className='photo-container'>
										<img
											id='profile-image'
											src={
												imageUrl !== null
													? imageUrl
													: basicProfileImage
											}
										/>
										<div className='button-container'>
											<div id='upload-photo-container'>
												<label
													id='upload-photo-button'
													htmlFor='profile-photo-input'
												>
													바꾸기
												</label>
												<input
													id='profile-photo-input'
													style={{
														visibility: 'hidden'
													}}
													type='file'
													name='photo'
													accept='image/*'
													onChange={
														fileChangedHandler
													}
												/>
											</div>
											<button
												id='delete-photo-button'
												onClick={(e) => {
													e.preventDefault()
													// eslint-disable-next-line @typescript-eslint/no-floating-promises
													setImageUrl('')
												}}
											>
												삭제하기
											</button>
										</div>
									</div>
								</div>
								<div className='user-info-input'>
									<div className='input-container'>
										<label>아이디</label>
										<span id='username-text'>
											{currentUser?.username}
										</span>
										<div className='input-status'></div>
									</div>
									<div className='input-container'>
										<label
											htmlFor='password-input'
											// className='required'
										>
											새 비밀번호
										</label>
										<div className='user-input-input'>
											<input
												className='user-input'
												id='password-input'
												type='password'
												name='password'
												onChange={(event) => {
													setPassword(
														event.target.value
													)
													setPasswordMessage(null)
												}}
												value={password}
											/>
											<span className='input-message'>
												영문자, 숫자 포함 10자 이상
												입력해주세요.
											</span>
											{passwordMessage !== null && (
												<span className='input-message red'>
													{passwordMessage}
												</span>
											)}
										</div>
										<div className='input-status'></div>
									</div>
									<div className='input-container'>
										<label
											htmlFor='password-confirm-input'
											// className='required'
										>
											비밀번호 확인
										</label>
										<div className='user-input-input'>
											<input
												className='user-input'
												id='password-confirm-input'
												type='password'
												name='password-confirm'
												onChange={(event) => {
													setPasswordConfirm(
														event.target.value
													)
													setPasswordConfirmMessage(
														null
													)
												}}
												value={passwordConfirm}
											/>
											{passwordConfirmMessage !==
												null && (
												<span className='input-message red'>
													{passwordConfirmMessage}
												</span>
											)}
										</div>
										<div className='input-status'>
											{matchPassword !== null &&
												(matchPassword ? (
													<MdDone
														size={30}
														style={{
															color: 'green'
														}}
													/>
												) : (
													<MdClear
														size={30}
														style={{ color: 'red' }}
													/>
												))}
										</div>
									</div>
									<div className='input-container'>
										<label htmlFor='email-input'>
											이메일
										</label>
										<div className='user-input-input'>
											<input
												className='user-input'
												id='email-input'
												type='text'
												name='email'
												onChange={(event) =>
													setEmail(event.target.value)
												}
												value={email}
											/>
										</div>
										<div className='input-status'></div>
									</div>
								</div>
							</div>
							<div>
								<button
									id='change-info-button'
									onClick={(e) => {
										e.preventDefault()
										// eslint-disable-next-line @typescript-eslint/no-floating-promises
										setEdit(false)
									}}
								>
									돌아가기
								</button>
								<button
									id='change-info-button'
									onClick={(e) => {
										e.preventDefault()
										// eslint-disable-next-line @typescript-eslint/no-floating-promises
										changeInfoHandler()
									}}
								>
									수정하기
								</button>
							</div>
						</form>
					) : (
						<div className='user-info-container'>
							<div className='user-info'>
								<div className='user-info-photo-container'>
									<img
										id='profile-image'
										src={
											currentUser?.photo_path !== null
												? currentUser?.photo_path
												: basicProfileImage
										}
									/>
								</div>
								<div className='info-container'>
									<div className='info'>
										<span>아이디: </span>
										<div className='info-text'>
											{currentUser?.username}
										</div>
									</div>
									<div className='info'>
										<span>이메일: </span>
										<div className='info-text'>
											{currentUser?.email}
										</div>
									</div>
								</div>
							</div>
							<div>
								<button
									id='edit-user-button'
									onClick={(e) => {
										e.preventDefault()
										setEdit(true)
									}}
								>
									회원정보 수정
								</button>
								<button
									id='delete-user-button'
									onClick={(e) => {
										e.preventDefault()
										// eslint-disable-next-line @typescript-eslint/no-floating-promises
										dispatch(deleteUser()).then(() => {
											navigate('/')
										})
									}}
								>
									회원 탈퇴
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	)
}
