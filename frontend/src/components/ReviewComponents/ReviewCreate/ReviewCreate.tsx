/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { checkPost, postListType, selectPost } from '../../../store/slices/post'
import { createReview, reviewListType } from '../../../store/slices/review'
import { checkLogin } from '../../../store/slices/user'
import { MdArrowBack } from 'react-icons/md'

import './ReviewCreate.scss'
import Combobox from 'react-widgets/Combobox'
import { selectApplication } from '../../../store/slices/application'
import Review from '../Review/Review'

export default function ReviewCreate() {
	const postState = useSelector(selectPost)
	const [title, setTitle] = useState<string>('')
	const [animalType, setAnimalType] = useState<string>('')
	const [postId, setPostId] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [file, setFile] = useState<File[]>([])

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(checkLogin()).then((result) => {
			const loggedIn: boolean = (result.payload as { logged_in: boolean })
				.logged_in
			if (!loggedIn) {
				alert('You should log in')
				navigate('/login')
			}
		})
	}, [])

	useEffect(() => {
		dispatch(checkPost())
	}, [])

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files !== null) setFile(file.concat(Array.from(files)))
	}

	const createReviewHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// console.log(title)
		// console.log(content)
		// console.log(file)

		if (title.length === 0) return
		if (animalType.length === 0) return
		if (file.length === 0) return
		if (postId.length === 0) return

		const words = postId.split(' ')

		const data = { title: title, animal_type: animalType, content: content }
		const formData = new FormData()
		formData.append('content', JSON.stringify(data))
		file.forEach((f, i) => formData.append('photos', f))
		formData.append('post_id', words[0])
		dispatch(createReview(formData))
			.then((result) => {
				navigate(`/review`)
			})
			.catch((err) => {
				console.log(err)
				alert('ERROR')
			})
		// navigate("/review");
	}

	// if (!userState.currentUser) {
	// 	return <Navigate to="/login" />;
	// } else {
	return (
		<Layout>
			<div className='CreateContainer'>
				<div className='ReviewCreate'>
					<button
						id='back-create-review-button'
						aria-label='back-button'
						onClick={(event) => {
							event.preventDefault()
							navigate('/review')
						}}
					>
						<MdArrowBack />
					</button>
					<div>
						<div className='create-header'>
							<h1>???????????? ?????????</h1>
						</div>
						<form
							className='create-review-container'
							onSubmit={createReviewHandler}
						>
							<div className='input-container'>
								<label htmlFor='review-title-input'>
									??????:
								</label>
								<input
									className='review-input'
									id='review-title-input'
									type='text'
									name='title'
									value={title}
									onChange={(event) =>
										setTitle(event.target.value)
									}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='review-animal-type-input'>
									??????:
								</label>
								<input
									className='review-input'
									id='review-animal-type-input'
									type='text'
									name='animalType'
									value={animalType}
									onChange={(event) =>
										setAnimalType(event.target.value)
									}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='review-post-input_input'>
									???????????? ??????:
								</label>
								<Combobox
									id='review-post-input'
									className='review-combobox'
									name='type'
									data={postState.posts.map(
										(post: postListType) => {
											return (
												post.id.toString() +
												' ' +
												post.title
											)
										}
									)}
									onChange={(event) => setPostId(event)}
									value={postId}
								/>
							</div>
							<div className='content-container'>
								<label htmlFor='review-content-input'>
									?????? ????????? ???????????????! ????????? ????????? ?????????
									????????? ?????????:&#41;
								</label>
								<textarea
									id='review-content-input'
									name='content'
									value={content}
									onChange={(event) =>
										setContent(event.target.value)
									}
								/>
							</div>
							<div className='photo-container'>
								<label
									htmlFor='review-photo-input'
									id='photoLabel'
								>
									??????:
								</label>
								<div id='filebox'>
									<label
										htmlFor='review-photo-input'
										id='photo'
									>
										?????? ??????
									</label>
									<input
										id='review-photo-input'
										type='file'
										multiple
										name='photo'
										accept='image/*'
										onChange={fileChangedHandler}
									/>
								</div>
							</div>
							{file.map((singleFile: File) => {
								return (
									<div
										id='filenameList'
										key={singleFile.name}
									>
										{singleFile.name}
									</div>
								)
							})}
							<button
								id='confirm-create-review-button'
								type='submit'
								disabled={!(title && content && postId)}
								// onClick={createReviewHandler}
							>
								????????????
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
	// }
}
