/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { checkLogin } from '../../../store/slices/user'
import {
	selectPost,
	getPost,
	deletePost,
	bookmarkPost
} from '../../../store/slices/post'
import { IoPawOutline, IoPaw } from 'react-icons/io5'

import './PostHeader.scss'

interface IProps {
	is_author: boolean
	is_bookmark: boolean
	setBookmark: Dispatch<SetStateAction<boolean>>
}

const PostHeader = (props: IProps) => {
	const postState = useSelector(selectPost)
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	const bookmarkPostHandler = () => {
		if (postState.selectedPost === null) return
		dispatch(checkLogin())
			.then((result) => {
				const loggedIn: boolean = (
					result.payload as { logged_in: boolean }
				).logged_in
				if (!loggedIn) {
					alert('You should log in')
					navigate('/login')
				}
			})
			.catch((err) => {
				console.log(err)
				alert('ERROR')
			})

		dispatch(bookmarkPost(postState.selectedPost.id))
			.then((result) => {
				props.setBookmark(result.payload.bookmark)
			})
			.catch((err) => {
				console.log(err)
				alert('ERROR')
			})
	}

	return (
		<div className='PostHeaderContainer'>
			<div className='post-title-container'>
				<h2 id='post-title' className='left'>
					{postState.selectedPost?.title}
				</h2>
				<div className='post-title-specs'>
					{postState.selectedPost?.species},{' '}
					{postState.selectedPost?.gender ? '암컷' : '수컷'},{' '}
					{postState.selectedPost?.author_name},
					{postState.selectedPost?.created_at}
				</div>
			</div>

			<div className='post-status'>
				{postState.selectedPost?.is_active ? (
					<div className='post-adoption-status' id='active'>
						입양상담 진행 중
					</div>
				) : (
					<div className='post-adoption-status' id='unactive'>
						입양상담 마감
					</div>
				)}

				<div className='bookmark-button-container'>
					{props.is_bookmark ? (
						<button
							className='bookmark-button'
							aria-label='bookmark-button bookmarked'
							onClick={bookmarkPostHandler}
						>
							<IoPaw size={40} />
						</button>
					) : (
						<button
							className='bookmark-button'
							aria-label='bookmark-button un-bookmarked'
							onClick={bookmarkPostHandler}
						>
							<IoPawOutline size={40} />
						</button>
					)}
				</div>
			</div>

			{!props.is_author && (
				<div className='post-button-container'>
					<button
						id='adopt-button'
						onClick={() => navigate('./submit')}
					>
						입양하기
					</button>
				</div>
			)}

			<div className='post-images'>
				{postState.selectedPost?.photo_path.map(
					(img_path, index: number) => {
						return (
							<img
								className='post-image'
								src={img_path.photo_path}
								key={index}
								alt={postState.selectedPost?.animal_type}
							/>
						)
					}
				)}
			</div>
		</div>
	)
}
export default PostHeader
