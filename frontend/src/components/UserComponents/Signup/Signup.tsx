/* eslint-disable object-shorthand */
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
	signupUser,
	UserSignupType,
	checkUsername
} from '../../../store/slices/user'
import { useNavigate } from 'react-router-dom'
import { MdDone, MdClear } from 'react-icons/md'
import './Signup.scss'

export default function Signup() {
	const [username, setUserName] = useState<string>('')
	const [usernameMessage, setUserNameMessage] = useState<string | null>(null)
	const [checked, setChecked] = useState<boolean | null>(null)
	const [password, setPassword] = useState<string>('')
	const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
	const [passwordConfirm, setPasswordConfirm] = useState<string>('')
	const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<
		string | null
	>(null)
	const [matchPassword, setMatchPassword] = useState<boolean | null>(null)
	const [email, setEmail] = useState<string>('')
	const [file, setFile] = useState<File[]>([])
	const [imageUrl, setImageUrl] = useState<string>('')

	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(checkLogin()).then((result) => {
			const loggedIn: boolean = (result.payload as { logged_in: boolean })
				.logged_in
			if (loggedIn) navigate('/')
		})
	}, [])

	useEffect(() => {
		if (password.length === 0 || passwordConfirm.length === 0)
			setMatchPassword(null)
		else if (password !== passwordConfirm) setMatchPassword(false)
		else setMatchPassword(true)
	}, [password, passwordConfirm])

	const checkDuplicateHandler = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setUserNameMessage(null)
		setPasswordConfirmMessage(null)
		setPasswordMessage(null)
		event.preventDefault()
		if (username === '') {
			setUserNameMessage('???????????? ??????????????????.')
			return
		}
		dispatch(checkUsername(username)).then((result) => {
			const confirm: boolean = (
				result.payload as {
					confirm: boolean
				}
			).confirm
			if (confirm) setChecked(true)
			else setChecked(false)
		})
	}
	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader()
		const files = event.target.files
		reader.onloadend = () => {
			setImageUrl(reader.result as string)
		}
		if (files !== null) {
			setFile(file.concat(Array.from(files)))
			reader.readAsDataURL(files[0])
		}
	}

	const signUpHandler = async () => {
		setUserNameMessage(null)
		setPasswordConfirmMessage(null)
		setPasswordMessage(null)
		if (username === '') {
			setUserNameMessage('???????????? ??????????????????.')
			return
		}
		if (checked === false) {
			setUserNameMessage('?????? ???????????? ??????????????????.')
			return
		}
		if (checked === null) {
			setUserNameMessage('????????? ??????????????? ????????????.')
			return
		}
		if (password === '') {
			setPasswordMessage('??????????????? ??????????????????.')
			return
		}
		if (passwordConfirm === '') {
			setPasswordConfirmMessage('??????????????? ?????? ??? ??? ??????????????????.')
			return
		}
		if (matchPassword === false) {
			setPasswordConfirmMessage('??????????????? ???????????? ????????????.')
			return
		}
		const pattern1 = /[0-9]/
		const pattern2 = /[a-zA-Z]/
		if (
			password.length < 10 ||
			!(pattern1.test(password) && pattern2.test(password))
		) {
			setPasswordMessage('??????????????? ?????? ??????????????????.')
			return
		}
		const userData: UserSignupType = {
			username: username,
			password: password,
			email: email
		}

		const formData = new FormData()
		formData.append('content', JSON.stringify(userData))
		file.forEach((f, i) => formData.append('photos', f))

		dispatch(signupUser(formData))
			// .unwrap()
			.then((result) => {
				navigate('/login')
			})
		// .catch((err) => {
		// 	alert('Sign up Error')
		// 	setUserName('')
		// 	setChecked(null)
		// 	setUserNameMessage(null)
		// 	setPasswordConfirmMessage(null)
		// 	setPasswordMessage(null)
		// 	setPassword('')
		// 	setPasswordConfirm('')
		// 	setEmail('')
		// })
	}

	return (
		<Layout>
			<div className='SignupContainer'>
				<div className='Signup'>
					<div className='signup-header'>
						<h1>????????????</h1>
					</div>
					<form className='signup-form'>
						<div className='signup-input-container'>
							<div className='signup-photo'>
								<div className='photo-container'>
									<img
										id='profile-image'
										src={
											imageUrl !== ''
												? imageUrl
												: basicProfileImage
										}
									/>
									<label
										htmlFor='profile-photo-input'
										id='upload-photo-button'
									>
										?????? ?????????
									</label>
									<input
										id='profile-photo-input'
										style={{ visibility: 'hidden' }}
										type='file'
										name='photo'
										accept='image/*'
										onChange={fileChangedHandler}
									/>
								</div>
							</div>
							<div className='signup-input'>
								<div className='input-container'>
									<label
										htmlFor='username-input'
										className='required'
									>
										?????????
									</label>
									<div className='signup-input-input'>
										<input
											className='user-input'
											id='username-input'
											type='text'
											name='username'
											onChange={(event) => {
												setUserName(event.target.value)
												setUserNameMessage(null)
												setChecked(null)
											}}
											value={username}
										/>
										{checked !== null &&
											(checked ? (
												<span className='input-message green'>
													?????? ????????? ??????????????????.
												</span>
											) : (
												<span className='input-message red'>
													????????? ??????????????????.
												</span>
											))}
										{usernameMessage !== null && (
											<span className='input-message red'>
												{usernameMessage}
											</span>
										)}
									</div>
									<div className='input-status'>
										<button
											id='duplicate-check'
											onClick={(event) => {
												checkDuplicateHandler(event)
											}}
										>
											????????????
										</button>
									</div>
								</div>
								<div className='input-container'>
									<label
										htmlFor='password-input'
										className='required'
									>
										????????????
									</label>
									<div className='signup-input-input'>
										<input
											className='user-input'
											id='password-input'
											type='password'
											name='password'
											onChange={(event) => {
												setPassword(event.target.value)
												setPasswordMessage(null)
											}}
											value={password}
										/>
										<span className='input-message'>
											?????????, ?????? ?????? 10??? ??????
											??????????????????.
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
										className='required'
									>
										???????????? ??????
									</label>
									<div className='signup-input-input'>
										<input
											className='user-input'
											id='password-confirm-input'
											type='password'
											name='password-confirm'
											onChange={(event) => {
												setPasswordConfirm(
													event.target.value
												)
												setPasswordConfirmMessage(null)
											}}
											value={passwordConfirm}
										/>
										{passwordConfirmMessage !== null && (
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
													style={{ color: 'green' }}
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
									<label htmlFor='email-input'>?????????</label>
									<div className='signup-input-input'>
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
						<button
							id='signup-button'
							onClick={(e) => {
								e.preventDefault()
								// eslint-disable-next-line @typescript-eslint/no-floating-promises
								signUpHandler()
							}}
						>
							????????????
						</button>
					</form>
				</div>
			</div>
		</Layout>
	)
}
