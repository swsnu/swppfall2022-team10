/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../Layout/Layout'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { checkLogin, loginUser, UserLoginType } from '../../store/slices/user'
import { Navigate, useNavigate } from 'react-router-dom'
import './Login.scss'

export default function LogIn() {
	const [username, setUserName] = useState<string>('')
	const [password, setPassword] = useState<string>('')

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

	const logInHandler = async () => {
		const userData: UserLoginType = {
			username,
			password
		}

		dispatch(loginUser(userData))
			.unwrap()
			.then((result) => {
				navigate('/')
			})
			.catch((err) => {
				// console.log(err)
				alert('ID or Password wrong')
				setUserName('')
				setPassword('')
			})
	}
	return (
		<Layout>
			<div className='Login'>
				<div className='login-header'>
					<h1>로그인</h1>
				</div>
				<form className='login-form'>
					<div className='login-input'>
						<input
							id='email-input'
							type='text'
							placeholder='아이디'
							value={username}
							onChange={(event) =>
								setUserName(event.target.value)
							}
						/>
						<input
							id='pw-input'
							type='password'
							placeholder='비밀번호'
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
						/>
					</div>
					<button
						id='login-button'
						onClick={(e) => {
							e.preventDefault()
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							logInHandler()
						}}
					>
						로그인
					</button>
				</form>
				<span id='login-signup'>
					계정이 없으신가요? <a href='/signup'>회원가입</a>하기
				</span>
			</div>
		</Layout>
	)
}
