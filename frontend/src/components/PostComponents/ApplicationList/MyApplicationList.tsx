/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect } from 'react'
import {
	getMyApplications,
	selectApplication,
	applicationType
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
	const example = [{
		id: 28,
        file: "dog_form.docx",
        created_at: "2022-12-07 05:36:25",
        post_id: 33,
        author_id: 3,
        author_name: "lenyakim"
	}]

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getMyApplications(props.id))
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
						{example.map((apply: applicationType) => {
							return (
								<tr key={`${apply.id}_apply`}>
									<td>{apply.id}</td>
									<td>
										<a href={`http://localhost:8000/api/posts/${apply?.post_id}/applications/${apply?.id}`}>{apply?.file}</a>
									</td>
									<td>{apply.created_at}</td>
									<td>
										<button
											id='apply-button'
											onClick={() => {
												// dispatch(deleteApplication(apply))
												console.log("hello")
											}}
										>
											<RiDeleteBin6Line />
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
		</div>
	)
}
