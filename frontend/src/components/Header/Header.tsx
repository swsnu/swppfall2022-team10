/* eslint-disable @typescript-eslint/no-floating-promises */

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { MdMenu } from 'react-icons/md'
import Dropdown from './Dropdown/Dropdown'
import { AppDispatch } from '../../store'
import { selectAnimal as postSelectAnimal } from '../../store/slices/post'
import { selectAnimal as reviewSelectAnimal } from '../../store/slices/review'

import './Header.scss'

interface IProps {
	animalOption: boolean
	pageName: string
}

export default function Header(props: IProps) {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [dropdownVisibility, setDropdownVisibility] = useState(false)
	const [animalType, setAnimalType] = useState('')

	useEffect(() => {
		if (props.pageName === 'post') dispatch(postSelectAnimal(animalType))
		else if (props.pageName === 'review')
			dispatch(reviewSelectAnimal(animalType))
	}, [animalType])

	return (
		<div className='Header'>
			<div className='menu-bar-header'>
				<div id='logo'>
					Be A<br />
					Family
				</div>
				<div>
					<button
						className='header-buttons'
						onClick={(event) => {
							event.preventDefault()
							navigate('/')
						}}
					>
						입양 절차 소개
					</button>
					{/* <button
						className='header-buttons'
						onClick={(event) => {
							event.preventDefault()
							navigate('/')
						}}
					>
						입양 게시글
					</button> */}
					<a className='header-buttons' href='/'>
						입양 게시글
					</a>
					<button
						className='header-buttons'
						onClick={(event) => {
							event.preventDefault()
							navigate('/review')
						}}
					>
						입양 후기
					</button>
				</div>
				<div>
					<button
						className='header-buttons'
						onClick={(event) => {
							event.preventDefault()
							navigate('/qna')
						}}
					>
						Q&A
					</button>
					<button
						className='header-buttons'
						aria-label='menu-button'
						onClick={() => {
							setDropdownVisibility(!dropdownVisibility)
						}}
					>
						<MdMenu />
					</button>
					<Dropdown visibility={dropdownVisibility} />
				</div>
			</div>
			<div className='list-header'>
				{props.animalOption && (
					<>
						<button
							className={
								animalType === '개'
									? 'list-header-button-selected'
									: 'list-header-button'
							}
							onClick={() => {
								setAnimalType('개')
							}}
						>
							개
						</button>
						<button
							className={
								animalType === '고양이'
									? 'list-header-button-selected'
									: 'list-header-button'
							}
							onClick={() => {
								setAnimalType('고양이')
							}}
						>
							고양이
						</button>
						<button
							className={
								animalType === '기타'
									? 'list-header-button-selected'
									: 'list-header-button'
							}
							onClick={() => {
								setAnimalType('기타')
							}}
						>
							기타
						</button>
					</>
				)}
			</div>
		</div>
	)
}
