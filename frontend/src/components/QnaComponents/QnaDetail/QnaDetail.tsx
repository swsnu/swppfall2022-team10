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
import { selectQna, qnaActions } from '../../../store/slices/qna'
import { useNavigate, Navigate } from 'react-router-dom'
import { selectComment, commentActions } from '../../../store/slices/comment'
import Comment from '../Comment/Comment'
import CommentList from '../CommentList/CommentList'
import './QnaDetail.scss'

const QnaDetail = () => {
	const { id } = useParams()
	const [content, setContent] = useState<string>('')

	const dispatch = useDispatch<AppDispatch>()
	const qnaState = useSelector(selectQna)
	const navigate = useNavigate()
	const commentState = useSelector(selectComment)

	const createCommentHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// eslint-disable-next-line no-useless-return
		if (content.length === 0) return
		console.log(content)

		const data = { content: content }
		const formData = new FormData()

		formData.append('content', JSON.stringify(data))
		dispatch(commentActions.addComment({
			qna_id: qnaState.selectedQna ? qnaState.selectedQna.id : 1000,
			author_id: 1,
			author_name: 'beafamily',
			content: content,
		}))
	}

	useEffect(() => {
		dispatch(qnaActions.getQna({ targetId: Number(id) }))
	}, [dispatch, id]
	)

	return (
		<Layout>
			<div className='DetailContainer'>
				<div className='title'>{qnaState.selectedQna?.title}</div>
				<div className='content'>{qnaState.selectedQna?.content}</div>
				<div className='CommentList'>
					<div className='comment-title'>Comment 목록:</div>
					<form
						className='create-comment-container'
						onSubmit={createCommentHandler}
					>
						<input
							id='comment-input'
							type='text'
							name='content'
							value={content}
							onChange={(event) => setContent(event.target.value)}
						/>
						<button
							id='confirm-create-content-button'
							type='submit'
							disabled={content.length === 0}
						>댓글 작성하기
						</button>
						<div><CommentList /></div>
					</form>
				</div>
			</div>


		</Layout>
	)
}

export default QnaDetail
