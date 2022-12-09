/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { AppDispatch } from '../../../store'
import { createApplication } from '../../../store/slices/application'
import { getPost } from '../../../store/slices/post'
import { checkLogin } from '../../../store/slices/user'
import './PostApply.scss'
import PostHeader from '../PostHeader/PostHeader'

export default function PostApply() {
	const { id } = useParams()
	const [file, setFile] = useState<File>()

	const navigate = useNavigate()

	const [editable, setEditable] = useState<boolean>(false)
	const [bookmark, setBookmark] = useState<boolean>(false)

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
		dispatch(getPost(Number(id))).then((result) => {
			setEditable(result.payload.editable)
			setBookmark(result.payload.bookmark)
		})
	}, [id])

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files !== null) setFile(files[0])
	}

	const ApplyHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!file) return
		if (!id) return
		const formData = new FormData()
		// formData.append('id', id)
		formData.append('application', file)
		// console.log(formData.get("id"))

		dispatch(createApplication({application: formData, postId: id}))
			.then((result) => {
			    navigate(`/post/${id}`)
			})
			.catch((err) => {
				console.log(err)
				alert('ERROR')
		 	})
	}

	return (
		<Layout>
			<div className='apply'>
				<div className='application'>
					<PostHeader
						is_author={true}
						is_bookmark={bookmark}
						setBookmark={setBookmark}
					/>
					<div>
						<form className='applyForm' onSubmit={ApplyHandler}>
							<div className='apply-container'>
								<h2>입양 신청서 제출하기</h2>
								<div className='input-container'>
									<label htmlFor='apply-file-input'>
										신청서:
									</label>
									<input
										id='apply-file-input'
										type='file'
										name='photo'
										accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
										onChange={fileChangedHandler}
									/>
								</div>
							</div>
							<button id='apply-button' type='submit'>
								보내기
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
