/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { checkLogin, logoutUser } from '../../../store/slices/user'
import { useNavigate } from 'react-router-dom'
import './Dropdown.scss'
import { useState, useEffect } from 'react'

export interface IProps {
	visibility: boolean
}

export default function Dropdown(props: IProps) {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [loggedIn, setLoggedIn] = useState<boolean>(false)

	useEffect(() => {
		dispatch(checkLogin()).then((result) => {
			setLoggedIn((result.payload as { logged_in: boolean }).logged_in)
		})
	}, [])

	const logOutHandler = () => {
		dispatch(logoutUser()).then((result) => navigate('/login'))
	}

	return (
		<div className='Dropdown'>
			{props.visibility && (
				<div>
					{loggedIn ? (
						<div className='dropdown-user dropdown-content'>
							<button
								className='dropdown-button'
								onClick={(event) => {
									event.preventDefault()
									navigate('/myinfo')
								}}
							>
								내 회원정보
							</button>
							<button
								className='dropdown-button'
								onClick={(event) => {
									event.preventDefault()
									navigate('/mypost')
								}}
							>
								내 포스트
							</button>
							<button
								className='dropdown-button'
								onClick={(event) => {
									event.preventDefault()
									logOutHandler()
								}}
							>
								로그아웃
							</button>
						</div>
					) : (
						<div className='dropdown-non-user dropdown-content'>
							<button
								className='dropdown-button'
								onClick={(event) => {
									event.preventDefault()
									navigate('/login')
								}}
							>
								로그인
							</button>
							<button
								className='dropdown-button'
								onClick={(event) => {
									event.preventDefault()
									navigate('/signup')
								}}
							>
								회원가입
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
