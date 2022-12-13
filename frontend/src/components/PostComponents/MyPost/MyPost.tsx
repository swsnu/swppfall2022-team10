/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Layout from '../../Layout/Layout'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from '../Post/Post'
import { postListType } from '../../../store/slices/post'
import {
	getReview,
	reviewListType,
	reviewType
} from '../../../store/slices/review'
import { QnaType } from '../../../store/slices/qna'
import {
	getMyPosts,
	selectMyPost,
	deleteQna,
	deleteReview
} from '../../../store/slices/mypost'
import { AppDispatch } from '../../../store'
import Review from '../../ReviewComponents/Review/Review'
import ReviewDetail from '../../ReviewComponents/ReviewDetail/ReviewDetail'
import Table from 'react-bootstrap/Table'
import { RiDeleteBin6Line } from 'react-icons/ri'

import './MyPost.scss'
import Modal from 'react-bootstrap/Modal'

export default function MyPost() {
	const navigate = useNavigate()
	const postState = useSelector(selectMyPost)
	const dispatch = useDispatch<AppDispatch>()

	const [mypostMore, setMypostMore] = useState<boolean>(false)
	const [mylikeMore, setMylikeMore] = useState<boolean>(false)
	const [myapplyMore, setMyapplyMore] = useState<boolean>(false)
	const [myreviewMore, setMyreviewMore] = useState<boolean>(false)
	const [myqnaMore, setMyqnaMore] = useState<boolean>(false)

	const mypost = postState.posts
	const mylike = postState.likes
	const myapply = postState.applys
	const myreview = postState.reviews
	const myqna = postState.qnas

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getMyPosts())
	}, [])

	const post = useMemo(() => {
		const shortMypost: postListType[] = mypost.slice(0, 4)
		if (mypost.length > 4) {
			if (mypostMore) {
				return mypost
			}
			return shortMypost
		}
		return mypost
	}, [mypostMore, mypost])

	const like = useMemo(() => {
		const shortMyLike: postListType[] = mylike.slice(0, 4)
		if (mylike.length > 4) {
			if (mylikeMore) {
				return mylike
			}
			return shortMyLike
		}
		return mylike
	}, [mylikeMore, mylike])

	const apply = useMemo(() => {
		const shortMyapply: postListType[] = myapply.slice(0, 4)
		if (myapply.length > 4) {
			if (myapplyMore) {
				return myapply
			}
			return shortMyapply
		}
		return myapply
	}, [myapplyMore, myapply])

	const review = useMemo(() => {
		const shortMyreview: reviewListType[] = myreview.slice(0, 4)
		if (myreview.length > 4) {
			if (myreviewMore) {
				return myreview
			}
			return shortMyreview
		}
		return myreview
	}, [myreviewMore, myreview])

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const onClickToggleModal = useCallback(() => {
		setModalOpen(!modalOpen)
	}, [modalOpen])
	const [clickedReview, setClickedReview] = useState<reviewType | null>(null)
	const onClickReview = useCallback(
		(id: number) => {
			setModalOpen(!modalOpen)
			dispatch(getReview(id)).then((result) => {
				setClickedReview(result.payload)
			})
		},
		[modalOpen, clickedReview]
	)

	const qna = useMemo(() => {
		const shortMyqna: QnaType[] = myqna.slice(0, 4)
		if (myqna.length > 4) {
			if (myqnaMore) {
				return myqna
			}
			return shortMyqna
		}
		return myqna
	}, [myqnaMore, myqna])

	const deleteReviewHandler = (id: number) => {
		if (id !== null) {
			onClickToggleModal()
			dispatch(deleteReview(id))
		}
	}

	return (
		<Layout>
			<div className='ListContainer'>
				<div className='MyPost'>
					<h1>입양 게시글</h1>
					<div className='showMore'>
						<button onClick={() => setMypostMore(!mypostMore)}>
							{mypost.length > 4 &&
								(mypostMore ? '닫기' : '전체보기')}
						</button>
					</div>
					<div className='posts-post'>
						{post.map((post: postListType) => {
							return (
								<Post
									key={`${post.id}_post`}
									title={post.title}
									animal_type={post.animal_type}
									thumbnail={post.thumbnail}
									species={post.species}
									age={post.age}
									gender={post.gender}
									author={post.author_name}
									clickDetail={() =>
										navigate(`/post/${post.id}`)
									}
								/>
							)
						})}
					</div>
				</div>
				<div className='MyLike'>
					<h1>관심 게시글</h1>
					<div className='showMore'>
						<button onClick={() => setMylikeMore(!mylikeMore)}>
							{mylike.length > 4 &&
								(mylikeMore ? '닫기' : '전체보기')}
						</button>
					</div>
					<div className='posts-like'>
						{like.map((post: postListType) => {
							return (
								<Post
									key={`${post.id}_post`}
									title={post.title}
									animal_type={post.animal_type}
									thumbnail={post.thumbnail}
									species={post.species}
									age={post.age}
									gender={post.gender}
									author={post.author_name}
									clickDetail={() =>
										navigate(`/post/${post.id}`)
									}
								/>
							)
						})}
					</div>
				</div>
				<div className='MyApply'>
					<h1>입양 신청 게시글</h1>
					<div className='showMore'>
						<button onClick={() => setMyapplyMore(!myapplyMore)}>
							{myapply.length > 4 &&
								(myapplyMore ? '닫기' : '전체보기')}
						</button>
					</div>
					<div className='posts-apply'>
						{apply.map((post: postListType) => {
							return (
								<Post
									key={`${post.id}_post`}
									title={post.title}
									animal_type={post.animal_type}
									thumbnail={post.thumbnail}
									species={post.species}
									age={post.age}
									gender={post.gender}
									author={post.author_name}
									clickDetail={() =>
										navigate(`/myapply/${post.id}`)
									}
								/>
							)
						})}
					</div>
				</div>
				<div className='MyReview'>
					<h1>입양 후기</h1>
					<div className='showMore'>
						<button onClick={() => setMyreviewMore(!myreviewMore)}>
							{myreview.length > 4 &&
								(myreviewMore ? '닫기' : '전체보기')}
						</button>
					</div>
					<div className='reviews'>
						{review.map((review: reviewListType) => {
							return (
								<button
									className='review-container'
									onClick={() => onClickReview(review.id)}
									key={`${review.id}`}
								>
									<Review
										key={`${review.id}_review`}
										title={review.title}
										thumbnail={review.thumbnail}
										author={review.author_name}
									/>
								</button>
							)
						})}
						<Modal
							show={modalOpen}
							onHide={onClickToggleModal}
							contentClassName='review'
						>
							<Modal.Header closeButton></Modal.Header>
							<Modal.Body>
								{clickedReview !== null && (
									<ReviewDetail
										key={`${clickedReview.id}_review`}
										id={clickedReview.id}
									/>
								)}
							</Modal.Body>
							<Modal.Footer>
								{clickedReview !== null && (
									<button
										id='review-delete-button'
										onClick={() =>
											deleteReviewHandler(
												clickedReview.id
											)
										}
									>
										삭제하기
									</button>
								)}
							</Modal.Footer>
						</Modal>
					</div>
				</div>
				<div className='MyQna'>
					<h1>내 Qna</h1>
					<div className='showMore'>
						<button onClick={() => setMyqnaMore(!myqnaMore)}>
							{myqna.length > 4 &&
								(myqnaMore ? '닫기' : '전체보기')}
						</button>
					</div>
					<div className='qnas'>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>#</th>
									<th>무엇이 궁금하세요?</th>
									<th>날짜</th>
									<th>삭제</th>
								</tr>
							</thead>
							<tbody>
								{qna.map((td: QnaType) => {
									return (
										<tr key={`${td.id}_qna`}>
											<td
												id='qna-click'
												onClick={() =>
													navigate(`/qna/${td.id}`)
												}
											>
												{td.id}
											</td>
											<td
												id='qna-click'
												onClick={() =>
													navigate(`/qna/${td.id}`)
												}
											>
												{td.title}
											</td>
											<td
												id='qna-click'
												onClick={() =>
													navigate(`/qna/${td.id}`)
												}
											>
												{td.created_at}
											</td>
											<td>
												<button
													id='qna-delete-button'
													onClick={() => {
														dispatch(
															deleteQna(td.id)
														)
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
			</div>
		</Layout>
	)
}
