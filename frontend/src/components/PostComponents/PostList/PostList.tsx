import Layout from '../../Layout/Layout'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Post from '../Post/Post'
import { getPosts, postType, selectPost } from '../../../store/slices/post'
import { AppDispatch } from '../../../store'
import { MdOutlineAddBox, MdSearch } from 'react-icons/md'

import Button from 'react-bootstrap/Button'

import './PostList.scss'

export default function PostList() {
	const navigate = useNavigate()

	const postState = useSelector(selectPost)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getPosts())
	}, [])

	return (
		<Layout>
			<div className='ListContainer'>
				<div className='PostList'>
					<div className='user-input-container'>
						<div className='category animal-container'>
							<div className='title'>종</div>
							<input className='type-space' placeholder='종' />
						</div>
						<div className='category date-container'>
							<div className='title'>보호 기간</div>
							<input
								className='type-space'
								placeholder='보호 기간'
							/>
						</div>
						<div className='category age-container'>
							<div className='title'>나이</div>
							<input className='type-space' placeholder='나이' />
						</div>
						<div className='category sex-container'>
							<div className='title'>성별</div>
							<input className='type-space' placeholder='성별' />
						</div>
						<div className='search-button'>
							<Button
								id='search-button'
								variant='outline-success'
							>
								<MdSearch size={20} />
							</Button>
						</div>
					</div>

					<div className='posts'>
						{postState.posts.map((post: postType) => {
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
					<div className='create-post'>
						<button
							id='create-post-button'
							onClick={() => navigate('/post/create')}
						>
							<MdOutlineAddBox size='50' />
						</button>
					</div>
				</div>
			</div>
		</Layout>
	)
}
