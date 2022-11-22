import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback } from 'react'
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
	id: string | undefined
}

const dummyList = [
	{
		id: 1,
		author_id: 1,
		author_name: 'jhpyun1',
		files: [],
		created_at: '2022-06-22',
		post_id: 1
	},
	{
		id: 2,
		author_id: 1,
		author_name: 'jhpyun2',
		files: [],
		created_at: '2022-06-23',
		post_id: 1
	},
	{
		id: 3,
		author_id: 1,
		author_name: 'jhpyun3',
		files: [],
		created_at: '2022-06-24',
		post_id: 1
	}
]

export default function ApplicationList(props: IProps) {
	const applicationState = useSelector(selectApplication)
	const dispatch = useDispatch<AppDispatch>()

	const [show, setShow] = useState(false)
	const [clickedApplication, setClickedApplication] =
		useState<applicationType>({
			id: 1,
			author_id: 1,
			author_name: 'jhpyun1',
			files: [],
			created_at: '2022-06-22',
			post_id: 1
		})
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
						{dummyList.map((apply: applicationType) => {
							return (
								<tr key={`${apply.id}_apply`}>
									<td>{apply.id}</td>
									<td>
										<button
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
				</Modal.Body>
			</Modal>
		</div>
	)
}
