import { useSelector } from 'react-redux'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { selectUser } from '../../store/slices/user'
import { ReactNode } from 'react'
import ScrollToTop from "./ScrollToTop";

import './Layout.scss'

interface IProps {
	children: ReactNode
}

export default function Layout({ children }: IProps) {
	const userState = useSelector(selectUser)
	return (
	    <>
	        <ScrollToTop />
		    <div className='Layout'>
			    <Header
				    userId={
					    userState.currentUser != null ? userState.currentUser.id : 0
				    }
			    />
			    <main>{children}</main>
			    <Footer />
		    </div>
		</>
	)
}
