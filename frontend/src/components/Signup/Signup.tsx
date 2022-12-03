/* eslint-disable n/handle-callback-err */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */

import Layout from '../Layout/Layout'
import basicProfileImage from '../../data/basic_profile_image.png'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import {
	checkLogin,
	signupUser,
	UserSignupType,
	checkUsername
} from '../../store/slices/user'
import { useNavigate } from 'react-router-dom'
import { MdDone, MdClear } from 'react-icons/md'
import './Signup.scss'

export default function Signup() {
	const [name, setName] = useState<string>('')
	const [username, setUserName] = useState<string>('')
	const [checked, setChecked] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const [passwordConfirm, setPasswordConfirm] = useState<string>('')
	const [matchPassword, setMatchPassword] = useState<boolean>(true)
	const [phoneNumber, setPhoneNumber] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [address, setAddress] = useState<string>('')
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
			setFile(file.concat(Array.from(files)))
			reader.readAsDataURL(files[0])
		}
	}

	const signUpHandler = async () => {
		const userData: UserSignupType = {
			username,
			password,
			name,
			phoneNumber,
			email,
			address
		}

		const formData = new FormData()
		formData.append('content', JSON.stringify(userData))
		file.forEach((f, i) => formData.append('photos', f))

		dispatch(signupUser(formData))
			.unwrap()
			.then((result) => {
				navigate('/login')
			})
			.catch((err) => {
				// console.log(err)
				alert('Sign up Error')
				setUserName('')
				setPassword('')
				setName('')
				setAddress('')
				setPhoneNumber('')
				setEmail('')
			})
	}
	return (
		<Layout>
			<div className='SignupContainer'>
				<div className='Signup'>
					<div className='signup-header'>
						<h1>회원가입</h1>
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
										사진 업로드
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
										htmlFor='name-input'
										className='required'
									>
										닉네임
									</label>
									<input
										className='user-input'
										id='name-input'
										type='text'
										name='name'
										onChange={(event) =>
											setName(event.target.value)
										}
										value={name}
									/>
									<div className='input-status'></div>
								</div>
								<div className='input-container'>
									<label
										htmlFor='username-input'
										className='required'
									>
										아이디
									</label>
									<input
										className='user-input'
										id='username-input'
										type='text'
										name='username'
										onChange={(event) => {
											setUserName(event.target.value)
											setChecked(false)
										}}
										value={username}
									/>
									<div className='input-status'>
										{checked ? (
											<MdDone
												size={30}
												style={{ color: 'green' }}
											/>
										) : (
											<button
												id='duplicate-check'
												onClick={(event) => {
													event.preventDefault()
													dispatch(
														checkUsername()
													).then((result) => {
														const confirm: boolean =
															(
																result.payload as {
																	confirm: boolean
																}
															).confirm
														if (confirm)
															setChecked(true)
													})
												}}
											>
												중복확인
											</button>
										)}
									</div>
								</div>
								<div className='input-container'>
									<label
										htmlFor='password-input'
										className='required'
									>
										비밀번호
									</label>
									<input
										className='user-input'
										id='password-input'
										type='password'
										name='password'
										onChange={(event) =>
											setPassword(event.target.value)
										}
										value={password}
									/>
									<div className='input-status'></div>
								</div>
								<div className='input-container'>
									<label
										htmlFor='password-confirm-input'
										className='required'
									>
										비밀번호 확인
									</label>
									<input
										className='user-input'
										id='password-confirm-input'
										type='password'
										name='password-confirm'
										onChange={(event) =>
											setPasswordConfirm(
												event.target.value
											)
										}
										value={passwordConfirm}
									/>
									<div className='input-status'>
										{matchPassword ? (
											<MdDone
												size={30}
												style={{ color: 'green' }}
											/>
										) : (
											<MdClear
												size={30}
												style={{ color: 'red' }}
											/>
										)}
									</div>
								</div>
								<div className='input-container'>
									<label htmlFor='email-input'>이메일</label>
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
									<div className='input-status'></div>
								</div>
								<div className='input-container'>
									<label htmlFor='address-input'>주소</label>
									<input
										className='user-input'
										id='address-input'
										type='text'
										name='address'
										onChange={(event) =>
											setAddress(event.target.value)
										}
										value={address}
									/>
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
							회원가입
						</button>
					</form>
				</div>
			</div>
		</Layout>
	)
}
