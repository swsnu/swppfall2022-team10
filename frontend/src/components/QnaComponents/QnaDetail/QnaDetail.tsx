/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Layout from '../../Layout/Layout'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { AppDispatch } from '../../../store'
import { selectQna, createComment, getQna } from '../../../store/slices/qna'
import { useNavigate, Navigate } from 'react-router-dom'
// import { selectComment, createComment } from '../../../store/slices/comment'
import CommentList from '../CommentList/CommentList'
import './QnaDetail.scss'
import { FaRegSmileBeam } from 'react-icons/fa'

const QnaDetail = () => {
	const { id } = useParams()
	const [content, setContent] = useState<string>('')

	const dispatch = useDispatch<AppDispatch>()
	const qnaState = useSelector(selectQna)
	const navigate = useNavigate()

	const createCommentHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// eslint-disable-next-line no-useless-return
		if (content.length === 0) return
		console.log(content)

		/* const data = { content: content }
		const formData = new FormData()

		formData.append('content', JSON.stringify(data)) */
		const idNum = id !== undefined ? parseInt(id) : -1
		dispatch(
			createComment({
				comment: { content: content },
				id: idNum
			})
		).catch((err) => {
			console.log(err)
			alert('ERROR')
		})
		
		dispatch(getQna(Number(id)))
	}

	useEffect(() => {
		dispatch(getQna(Number(id)))
	}, [dispatch, id])

	return (
		<Layout>
			<div className='DetailContainer'>
				<div className='title'>{qnaState.selectedQna?.title}</div>
				<div className='content'>{qnaState.selectedQna?.content}</div>
				<br />
				<br />
				<div className='CommentList'>
					<div className='comment-title'></div>
					<form
						className='create-comment-container'
						onSubmit={createCommentHandler}
					>
						<label className='input-text' htmlFor='comment-input'>
							????????? ??????????????? <FaRegSmileBeam />
						</label>
						<br />
						<br />
						<div className='input-box'>
							<input
								id='comment-input'
								type='text'
								name='content'
								value={content}
								onChange={(event) => setContent(event.target.value)}
							/>
						</div>
						<br />
						<button
							className='input-button'
							id='confirm-create-content-button'
							type='submit'
							disabled={content.length === 0}
						>
							?????? ????????????
						</button>
						<div>
							<CommentList />
						</div>
					</form>
				</div>
			</div>
		</Layout>
	)
}

export default QnaDetail
