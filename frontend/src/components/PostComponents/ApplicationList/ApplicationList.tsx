/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect } from 'react'
import {
	getApplications,
	selectApplication,
	applicationType
} from '../../../store/slices/application'
import { AppDispatch } from '../../../store'

import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import './ApplicationList.scss'

interface IProps {
	id: string
}

export default function ApplicationList(props: IProps) {
	const applicationState = useSelector(selectApplication)
	const dispatch = useDispatch<AppDispatch>()

	const [show, setShow] = useState(false)
	const [clickedApplication, setClickedApplication] =
		useState<applicationType>({
			id: 1,
			author_id: 1,
			author_name: 'jhpyun1',
			file: null,
			created_at: '2022-06-22',
			post_id: 1
		})

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getApplications(props.id))
	}, [])

	const handleClose = () => setShow(false)
	const onClickApp = useCallback(
		(apply: applicationType) => {
			setShow(true)
			setClickedApplication(apply)
		},
		[show, clickedApplication]
	)

	return (
		<div className='application-list'>
			<div className='title'>입양신청서 목록</div>
			<div className='lists'>
				<Table borderless hover>
					<thead>
						<tr>
							<th id='index'>번호</th>
							<th>제목</th>
							<th id='date'>신청일시</th>
						</tr>
					</thead>
					<tbody>
						{applicationState.applications.map((apply: applicationType) => {
							return (
								<tr key={`${apply.id}_apply`}>
									<td>{apply.id}</td>
									<td>
										<button
											id='apply-button'
											onClick={() => onClickApp(apply)}
										>
											{apply.author_name}님이 보낸 입양
											신청서입니다.
										</button>
									</td>
									<td>{apply.created_at}</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
			<Modal
				show={show}
				onHide={handleClose}
				contentClassName='app-content'
			>
				<Modal.Header closeButton>입양신청서 다운로드</Modal.Header>
				<Modal.Body>
					<div>신청자: {clickedApplication.author_name}</div>
					<div>신청일시: {clickedApplication.created_at}</div>
					<div>신청서:</div>
					<div className='buttons'>
						<button id='accept-button'>수락</button>
						<button id='reject-button'>거절</button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	)
}
