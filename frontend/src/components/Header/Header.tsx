import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { MdMenu } from 'react-icons/md'
import Dropdown from './Dropdown/Dropdown'
import { AppDispatch } from '../../store'
import { selectAnimal } from '../../store/slices/post'

import './Header.scss'

interface IProps {
	animalOption: boolean
}

export default function Header(props: IProps) {
	const navigate = useNavigate()
	const [dropdownVisibility, setDropdownVisibility] = useState(false)
	const [animalType, setAnimalType] = useState('')
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(selectAnimal(animalType))
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
							className='list-header-buttons'
							onClick={() => {
								setAnimalType('개')
							}}
						>
							개
						</button>
						<button
							className='list-header-buttons'
							onClick={() => {
								setAnimalType('고양이')
							}}
						>
							고양이
						</button>
						<button
							className='list-header-buttons'
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
