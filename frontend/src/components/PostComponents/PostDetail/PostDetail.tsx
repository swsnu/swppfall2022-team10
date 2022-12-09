/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Layout from '../../Layout/Layout'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { selectPost, getPost, deletePost } from '../../../store/slices/post'
import { FaSyringe, FaRegMeh } from 'react-icons/fa'
import PostHeader from '../PostHeader/PostHeader'
import ApplicationList from '../ApplicationList/ApplicationList'

import './PostDetail.scss'

interface IProps {
	is_author: boolean
}

const PostDetail = (props: IProps) => {
	const { id } = useParams()
	const dispatch = useDispatch<AppDispatch>()
	const postState = useSelector(selectPost)
	const navigate = useNavigate()
	const [editable, setEditable] = useState<boolean>(false)

	useEffect(() => {
		dispatch(getPost(Number(id))).then((result) => {
			// setEditable(result.payload.editable)
			setEditable(true)
		})
	}, [id])

	return (
		<Layout>
			<div className='DetailContainer'>
				<div className='PostDetail'>
					<PostHeader is_author={props.is_author} />
					<div className='post-content-container'>
						<div className='first-line'>
							새로운 집을 찾고 있는,{' '}
							{postState.selectedPost?.name}
						</div>
						<div className='second-line'>
							{postState.selectedPost?.age}세{' '}
							{postState.selectedPost?.gender ? '암컷' : '수컷'}{' '}
							{postState.selectedPost?.species}
						</div>
						<div className='injection'>
							<FaSyringe />{' '}
							{postState.selectedPost?.vaccination
								? '백신 접종 완료한 동물입니다.'
								: '백신 접종을 하지 않았습니다.'}
						</div>
						<div className='neuter'>
							<FaRegMeh />{' '}
							{postState.selectedPost?.neutering
								? '중성화 완료한 동물입니다.'
								: '중성화 하지 않은 동물입니다.'}
						</div>

						<br />
						<div className='det1'>
							{postState.selectedPost?.name}에 대해 알려드려요{' '}
							<br />
						</div>
						<div className='det2'>
							{postState.selectedPost?.content
								.split('\n')
								.map((line, index) => {
									return (
										<span key={index}>
											{line}
											<br />
										</span>
									)
								})}
						</div>
					</div>
					{props.is_author && <ApplicationList id={id} />}
					{editable && (
						<div className='post-buttons'>
							<button
								id='edit-post-button'
								onClick={() => {
									navigate(`/post/${id}/edit`)
								}}
							>
								수정
							</button>
							<button
								id='delete-post-button'
								onClick={() => {
									dispatch(deletePost(Number(id)))
									navigate('/')
								}}
							>
								삭제
							</button>
						</div>
					)}
				</div>
			</div>
		</Layout>
	)
}
export default PostDetail
