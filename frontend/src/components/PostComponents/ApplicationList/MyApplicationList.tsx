/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	getApplications,
	selectApplication,
	applicationType,
	deleteApplication
} from '../../../store/slices/application'
import { AppDispatch } from '../../../store'
import Table from 'react-bootstrap/Table'
import './ApplicationList.scss'
import { RiDeleteBin6Line } from 'react-icons/ri'

interface IProps {
	id: string
}

export default function MyApplicationList(props: IProps) {
	const applicationState = useSelector(selectApplication)
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getApplications(props.id))
	}, [])

	return (
		<div className='application-list'>
			<div className='title'>내가 작성한 입양신청서</div>
			<div className='lists'>
				<Table borderless hover>
					<thead>
						<tr>
							<th id='index'>번호</th>
							<th>파일</th>
							<th id='date'>신청일시</th>
							<th>삭제</th>
						</tr>
					</thead>
					<tbody>
						{applicationState.applications.map(
							(apply: applicationType) => {
								return (
									<tr key={`${apply.id}_apply`}>
										<td>{apply.id}</td>
										<td>
											<a
												href={`/api/posts/${apply?.post_id}/applications/${apply?.id}`}
											>
												{apply?.file}
											</a>
										</td>
										<td>{apply.created_at}</td>
										<td>
											<button
												id='delete-button'
												onClick={() => {
													dispatch(
														deleteApplication(apply)
													)
													navigate(`/mypost/`)
												}}
											>
												<RiDeleteBin6Line />
											</button>
										</td>
									</tr>
								)
							}
						)}
					</tbody>
				</Table>
			</div>
		</div>
	)
}
