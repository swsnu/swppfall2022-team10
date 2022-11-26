/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { Dispatch, SetStateAction } from 'react'
import './Pagination.scss'

interface IProps {
	itemsPerPage: number
	totalItems: number
	currentPage: number
	paginate: Dispatch<SetStateAction<number>>
}

const Pagination = (props: IProps) => {
	const pageNumbers = []
	const totalPages = Math.ceil(props.totalItems / props.itemsPerPage)
	if (totalPages <= 9)
		for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
	else if (props.currentPage <= 5)
		for (let i = 1; i <= 9; i++) pageNumbers.push(i)
	else if (props.currentPage >= totalPages - 4)
		for (let i = totalPages - 8; i <= totalPages; i++) pageNumbers.push(i)
	else
		for (let i = props.currentPage - 4; i <= props.currentPage + 4; i++)
			pageNumbers.push(i)

	return (
		<div>
			<nav>
				<ul className='pagination'>
					<li className='page-item'>
						<span
							className='page-link'
							id='prev'
							onClick={() => {
								if (props.currentPage !== 1)
									props.paginate(props.currentPage - 1)
								window.scrollTo(0, 0)
							}}
						>
							{'<'}
						</span>
					</li>
					{pageNumbers.map((number) => (
						<li key={number} className={'page-item'}>
							<span
								onClick={() => {
									props.paginate(number)
									window.scrollTo(0, 0)
								}}
								className={
									props.currentPage === number
										? 'page-link clicked'
										: 'page-link'
								}
							>
								{number}
							</span>
						</li>
					))}
					<li className='page-item'>
						<span
							className='page-link'
							id='next'
							onClick={() => {
								if (props.currentPage !== totalPages)
									props.paginate(props.currentPage + 1)
								window.scrollTo(0, 0)
							}}
						>
							{'>'}
						</span>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Pagination
