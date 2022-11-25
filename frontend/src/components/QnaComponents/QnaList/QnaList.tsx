/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Qna from '../Qna/Qna'
import { getQnas, QnaType, selectQna } from '../../../store/slices/qna'
import { AppDispatch } from '../../../store'
import { MdOutlineAddBox } from 'react-icons/md'

import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'

import './QnaList.scss'

export default function QnaList() {
	const navigate = useNavigate()

	const qnaState = useSelector(selectQna)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(getQnas())
	}, [])

	return (
		<Layout>
			<div className='ListContainer'>
				<div className='FaqContainer'>
					<div className='title'>FAQs</div>
					<div className='Faqs'>
						<Accordion>
							<Accordion.Item eventKey='0'>
								<Accordion.Header>
									동물이 밥을 먹지 않아요.
								</Accordion.Header>
								<Accordion.Body>
									병원에 데려가세요.
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey='1'>
								<Accordion.Header>
									동물이 우울해 해요.
								</Accordion.Header>
								<Accordion.Body>
									저런. 병원에 데려가세요.
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey='2'>
								<Accordion.Header>
									동물이 아파요.
								</Accordion.Header>
								<Accordion.Body>
									병원에 데려가세요.
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey='3'>
								<Accordion.Header>
									동물이 자지 않아요.
								</Accordion.Header>
								<Accordion.Body>
									병원에 데려가세요.
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</div>
				</div>
				<div className='QnaContainer'>
					<div className='title'>Q&As</div>
					<div className='search-window'>Search-window</div>
					<div className='Qnas'>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>#</th>
									<th>무엇이 궁금하세요?</th>
									<th>날짜</th>
									<th>조회수</th>
								</tr>
							</thead>
							<tbody>
								{qnaState.qnas.map((td: QnaType) => {
									return (
										<tr
											key={`${td.id}_qna`}
											onClick={() =>
												navigate(`/qna/${td.id}`)
											}
										>
											<td>{td.id}</td>
											<td>{td.title}</td>
											<td>{td.created_at}</td>
											<td>{td.hits}</td>
										</tr>
									)
								})}
							</tbody>
						</Table>
					</div>
				</div>
				<div className='create-qna'>
					<button
						id='create-qna-button'
						onClick={() => navigate('/qna/create')}
					>
						<MdOutlineAddBox size='50' />
					</button>
				</div>
			</div>
		</Layout>
	)
}
