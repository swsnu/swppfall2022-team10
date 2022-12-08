/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Layout from '../../Layout/Layout'

import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from '../Post/Post'
import { postListType, postType } from '../../../store/slices/post'
import { getMyPosts, selectMyPost } from '../../../store/slices/mypost'
import { AppDispatch } from '../../../store'

import './MyPost.scss'

export default function MyPost() {
	const navigate = useNavigate()
	const postState = useSelector(selectMyPost)
	const dispatch = useDispatch<AppDispatch>()

	const [mypostMore, setMypostMore] = useState<boolean>(false)
	const [mylikeMore, setMylikeMore] = useState<boolean>(false)
	const [myapplyMore, setMyapplyMore] = useState<boolean>(false)

	const mypost = postState.posts
	const mylike = postState.likes
	const myapply = postState.applys

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
									photo_path={post.photo_path}
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
									photo_path={post.photo_path}
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
						{/* {apply.map((post: postListType) => {
							console.log(post.photo_path)
							return (
								<Post
									key={`${post.id}_post`}
									title={post.title}
									animal_type={post.animal_type}
									photo_path={post.photo_path}
									species={post.species}
									age={post.age}
									gender={post.gender}
									author={post.author_name}
									clickDetail={() =>
										navigate(`/post/${post.id}`)
									}
								/>
							)
						})} */}
					</div>
				</div>
			</div>
		</Layout>
	)
}
