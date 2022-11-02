import { useSelector } from 'react-redux'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { selectUser } from '../../store/slices/user'
import { ReactNode } from 'react'

import './Layout.scss'

interface IProps {
	children: ReactNode
}

export default function Layout({ children }: IProps) {
	const userState = useSelector(selectUser)
	return (
		<div className='Layout'>
			<Header
				userId={
					userState.currentUser != null ? userState.currentUser.id : 0
				}
			/>
			<main>{children}</main>
			<Footer
				userId={
					userState.currentUser != null ? userState.currentUser.id : 0
				}
			/>
		</div>
	)
}
