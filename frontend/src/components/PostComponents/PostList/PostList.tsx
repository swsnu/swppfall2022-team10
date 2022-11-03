import Layout from '../../Layout/Layout'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Post from '../Post/Post'
import { getPosts, postType, selectPost } from '../../../store/slices/post'
import { AppDispatch } from '../../../store'
import { MdFilterList, MdOutlineAddBox, MdSearch } from 'react-icons/md'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

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
					<Form className='d-flex search-bar'>
						<Form.Control
							type='search'
							placeholder='종        |         보호기간        |        나이/성별'
							onfocus="this.placeholder=''"
							className='me-2'
							id='search-input'
							aria-label='Search'
						/>
						<Button id='search-button' variant='outline-success'>
							<MdSearch size={50} />
						</Button>
					</Form>
					<button id='list-filter-button'>
						<MdFilterList size='25' />
					</button>
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
