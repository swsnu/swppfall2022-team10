/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Layout from '../../Layout/Layout'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { selectPost, getPost, deletePost } from '../../../store/slices/post'
import { selectUser, getUser } from '../../../store/slices/user'
import { IoList } from 'react-icons/io5'
import PostHeader from '../PostHeader/PostHeader'

import './PostDetail.scss'

interface IProps {
	is_author: boolean
}

const PostDetail = (props: IProps) => {
	const { id } = useParams()
	const dispatch = useDispatch<AppDispatch>()
	const userState = useSelector(selectUser)
	const postState = useSelector(selectPost)
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getPost(Number(id)))
		if (postState.selectedPost != null)
			dispatch(getUser(postState.selectedPost.author_id))
	}, [id])

	return (
		<Layout>
			<div className='DetailContainer'>
				<div className='PostDetail'>
					<button
						id='back-detail-post-button'
						onClick={() => navigate('/')}
					>
						<IoList />
						{/* &nbsp; 목록 */}
					</button>
					<PostHeader is_author={props.is_author} />
					<div className='post-content-container'>
						<ul className='post-content'>
							<li>이름: {postState.selectedPost?.name}</li>
							<li>나이: {postState.selectedPost?.age}세</li>
							<li>
								성별:{' '}
								{postState.selectedPost?.gender
									? '암컷'
									: '수컷'}
							</li>
							<li>품종: {postState.selectedPost?.species}</li>
							<li>
								백신접종여부:{' '}
								{postState.selectedPost?.vaccination
									? 'O'
									: 'X'}
							</li>
							<li>
								중성화여부:{' '}
								{postState.selectedPost?.neutering ? 'O' : 'X'}
							</li>
							<br />
							<li>
								특징: <br />
								{postState.selectedPost?.character
									.split('\n')
									.map((line) => {
										return (
											<span>
												{line}
												<br />
											</span>
										)
									})}
							</li>
						</ul>
					</div>
					{postState.selectedPost?.author_id ===
						userState.currentUser?.id && (
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
