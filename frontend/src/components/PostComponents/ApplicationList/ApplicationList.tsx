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
	applicationType,
	acceptApplication
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
			file: '',
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
	const acceptHandler = (aid: number) => {
		dispatch(
			acceptApplication({ id: aid.toString(), postId: props.id })
		).then((result) => {
			handleClose()
			alert(
				'입양신청서 수락이 완료되었습니다. 입양게시글이 마감으로 표시되며, 게시글로 온 신청서는 더 이상 보이지 않습니다.'
			)
			dispatch(getApplications(props.id))
		})
	}

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
						{applicationState.applications.map(
							(apply: applicationType) => {
								return (
									<tr key={`${apply.id}_apply`}>
										<td>{apply.id}</td>
										<td>
											<button
												id='apply-button'
												onClick={() =>
													onClickApp(apply)
												}
											>
												{apply.author_name}님이 보낸
												입양 신청서입니다.
											</button>
										</td>
										<td>{apply.created_at}</td>
									</tr>
								)
							}
						)}
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
					<a
						href={`/api/posts/${clickedApplication?.post_id}/applications/${clickedApplication?.id}`}
					>
						{clickedApplication?.file}
					</a>
					<div className='buttons'>
						<button
							id='accept-button'
							onClick={() => acceptHandler(clickedApplication.id)}
						>
							수락
						</button>
						<button id='reject-button'>거절</button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='notice'>
				※ 수락 버튼을 누르면 게시물은 마감되고, 입양신청서를 다시 받을
				수 없으니 신중히게 눌러주세요.
			</div>
		</div>
	)
}
