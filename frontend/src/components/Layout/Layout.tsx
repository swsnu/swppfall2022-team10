import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { ReactNode } from 'react'
import ScrollToTop from "./ScrollToTop";

import './Layout.scss'

interface IProps {
	children: ReactNode
}

export default function Layout({ children }: IProps) {
	return (
	    <>
	        <ScrollToTop />
		    <div className='Layout'>
			    <Header />
			    <main>{children}</main>
			    <Footer />
		    </div>
		</>
	)
}
