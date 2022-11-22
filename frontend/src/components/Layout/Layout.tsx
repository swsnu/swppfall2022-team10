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

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		if (children.props.className === 'ListContainer') {
			setAnimalOption(true)
		} else {
			setAnimalOption(false)
		}
	}, [children])

	return (
		<>
			<ScrollToTop />
			<div className='Layout'>
				<Header animalOption={animalOption} />
				<main>{children}</main>
				<Footer />
			</div>
		</>
	)
}
