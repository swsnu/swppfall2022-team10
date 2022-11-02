import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MdMenu } from 'react-icons/md'
import Dropdown from './Dropdown/Dropdown'

import './Header.scss'

export interface IProps {
	userId: number
}

export default function Header(props: IProps) {
	const navigate = useNavigate()
	const [dropdownVisibility, setDropdownVisibility] = useState(false)

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
					<button
						className='header-buttons'
						onClick={(event) => {
							event.preventDefault()
							navigate('/')
						}}
					>
						입양 게시글
					</button>
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
						onClick={() => {
							setDropdownVisibility(!dropdownVisibility)
						}}
					>
						<MdMenu />
					</button>
					<Dropdown
						visibility={dropdownVisibility}
						userId={props.userId}
					/>
				</div>
			</div>
			<div className='list-header'></div>
		</div>
	)
}
