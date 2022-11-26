/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Layout from '../../Layout/Layout'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { selectQna, getQna, qnaActions } from '../../../store/slices/qna'
import './QnaDetail.scss'

/* 
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { selectPost, getPost, deletePost } from '../../../store/slices/post'
import { FaSyringe, FaRegMeh } from 'react-icons/fa'
import PostHeader from '../PostHeader/PostHeader'
 */

const QnaDetail = () => {
	const { id } = useParams()
	const dispatch = useDispatch()
	const qnaState = useSelector(selectQna)

	useEffect(() => {
		dispatch(qnaActions.getQna({ targetId: Number(id) }))
	}, [dispatch, id])

	return (
		<Layout>
			<div className='DetailContainer'>
				<div className='title'>{qnaState.selectedQna?.title}</div>
				<div className='content'>{qnaState.selectedQna?.content}</div>
			</div>
		</Layout>
	)
}

export default QnaDetail
