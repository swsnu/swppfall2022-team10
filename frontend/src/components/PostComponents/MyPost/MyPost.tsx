import Layout from '../../Layout/Layout'

import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../../store/slices/user'
import { useNavigate } from 'react-router-dom'
import Post from '../Post/Post'
import { getPosts, postType, selectPost } from '../../../store/slices/post'
import { AppDispatch } from '../../../store'

import './MyPost.scss'

export default function MyPost() {
	const navigate = useNavigate()
	const postState = useSelector(selectPost)
	const dispatch = useDispatch<AppDispatch>()
	const userState = useSelector(selectUser)
	// 	const [mypostMore, setMypostMore] = useState<boolean>(false)
	// 	const [mylikeMore, setMylikeMore] = useState<boolean>(false)
	// 	const [myapplyMore, setMyapplyMore] = useState<boolean>(false)
	//  const postLimit = useRef<number>(4);
	//     const commenter = useMemo(() => { 		// 조건에 따라 게시글을 보여주는 함수
	//         const shortMylike: string = mylike.slice(0, textLimit.current);
	//
	//         if (mylike.length > postLimit.current) {
	//             if (mylikeMore) { return mylike; }
	//             return shortMylike;
	//         }
	//         return mylike;
	//     }, [mylikeMore]);

	const mypost = postState.posts.slice(0, 4)
	const mylike = postState.posts.slice(4, 10)
	const myapply = postState.posts.slice(4, 9)

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getPosts())
	}, [])

	return (
		<Layout>
			<div className='ListContainer'>
				<div className='MyPost'>
					<h1>입양 게시글</h1>
					<div className='posts'>
						{mypost.map((post: postType) => {
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
					<div className='posts'>
						{mylike.map((post: postType) => {
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
					<div className='posts'>
						{myapply.map((post: postType) => {
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
			</div>
		</Layout>
	)
}
