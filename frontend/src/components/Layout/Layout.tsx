import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { useState, ReactElement, useEffect } from 'react'
import ScrollToTop from './ScrollToTop'
import './Layout.scss'

interface IProps {
	children: ReactElement
}

export default function Layout({ children }: IProps) {
	const [animalOption, setAnimalOption] = useState<boolean>(false)
	const [pageName, setPageName] = useState<string>('')

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		if (children.props.className === 'PostListContainer') {
			setAnimalOption(true)
			setPageName('post')
		} else if (children.props.className === 'ReviewListContainer') {
			setAnimalOption(true)
			setPageName('review')
		} else {
			setAnimalOption(false)
		}
	}, [children])

	return (
		<>
			<ScrollToTop />
			<div className='Layout'>
				<Header animalOption={animalOption} pageName={pageName} />
				<main>{children}</main>
				<Footer />
			</div>
		</>
	)
}
