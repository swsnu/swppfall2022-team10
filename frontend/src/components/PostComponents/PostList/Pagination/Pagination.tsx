/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { Dispatch, SetStateAction, useState } from 'react'
import './Pagination.scss'

interface IProps {
	postsPerPage: number
	totalPosts: number
	paginate: Dispatch<SetStateAction<number>>
}

const Pagination = (props: IProps) => {
	const [selectedPage, setSelectedPage] = useState<number>(1)
	const pageNumbers = []
	for (
		let i = 1;
		i <= Math.ceil(props.totalPosts / props.postsPerPage);
		i++
	) {
		pageNumbers.push(i)
	}
	return (
		<div>
			<nav>
				<ul className='pagination'>
					<li className='page-item'>
						<span className='page-link' id='prev'>
							{'<'}
						</span>
					</li>
					{pageNumbers.map((number) => (
						<li key={number} className={'page-item'}>
							<span
								onClick={() => {
									props.paginate(number)
									setSelectedPage(number)
									window.scrollTo(0, 0)
								}}
								className={
									selectedPage === number
										? 'page-link clicked'
										: 'page-link'
								}
							>
								{number}
							</span>
						</li>
					))}
					<li className='page-item'>
						<span className='page-link' id='next'>
							{'>'}
						</span>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Pagination
