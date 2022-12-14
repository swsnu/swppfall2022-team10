/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import {
	getPost,
	editPost,
	selectPost,
	deletePostImage
} from '../../../store/slices/post'
import { checkLogin } from '../../../store/slices/user'
import { MdArrowBack } from 'react-icons/md'
import Combobox from 'react-widgets/Combobox'
import DropdownList from 'react-widgets/DropdownList'
import ImageModal from './ImageModal/ImageModal'
import 'react-widgets/scss/styles.scss'
import './PostEdit.scss'
import { Dictionary } from '@reduxjs/toolkit'
import { List } from 'reselect/es/types'

export default function PostEdit() {
	const { id } = useParams()

	const [title, setTitle] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [animalType, setAnimalType] = useState<string>('')
	const [species, setSpecies] = useState<string>('')
	const [age, setAge] = useState<string>('')
	const [gender, setGender] = useState<string>('')
	const [vaccination, setVaccination] = useState<string>('')
	const [neutering, setNeutering] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [imageUrl, setImageUrl] = useState<
		Array<{ id: number; photo_path: string }>
	>([])
	const [file, setFile] = useState<File[]>([])
	const [editable, setEditable] = useState<boolean>(true)
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [clickedImage, setClickedImage] = useState<string>('')
	const [applyForm, setApplyForm] = useState<File[]>([])

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const postState = useSelector(selectPost)

	useEffect(() => {
		dispatch(checkLogin()).then((result) => {
			const loggedIn: boolean = (result.payload as { logged_in: boolean })
				.logged_in
			if (!loggedIn) {
				navigate('/login')
			}
		})
		dispatch(getPost(Number(id))).then((result) => {
			const currentPost = result.payload.post
			if (currentPost) {
				setTitle(currentPost.title)
				setName(currentPost.name)
				setAnimalType(currentPost.animal_type)
				setSpecies(currentPost.species)
				setAge(String(currentPost.age))
				setGender(currentPost.gender ? '??????' : '??????')
				setVaccination(currentPost.vaccination ? 'O' : 'X')
				setNeutering(currentPost.neutering ? 'O' : 'X')
				setContent(currentPost.content)
				setImageUrl(currentPost.photo_path)
			}
			setEditable(result.payload.editable)
		})
	}, [id])

	useEffect(() => {
		if (!editable) {
			navigate('/login')
		}
	}, [editable])

	const fields = [
		title,
		name,
		animalType,
		species,
		age,
		gender,
		vaccination,
		neutering,
		content
	]

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		// console.log(files)
		if (files !== null) setFile(file.concat(Array.from(files)))
	}

	const applyFormChangedHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const applyForms = event.target.files
		if (applyForms !== null) setApplyForm([applyForms[0]])
	}

	const editPostHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		// console.log('editPost')
		if (postState.selectedPost === null || id === undefined) return
		event.preventDefault()
		const data = {
			title: title,
			name: name,
			animal_type: animalType,
			species: species,
			age: parseInt(age),
			gender: gender === '??????',
			neutering: neutering === 'O',
			vaccination: vaccination === 'O',
			content: content
		}
		const formData = new FormData()
		formData.append('content', JSON.stringify(data))
		file.forEach((f, i) => formData.append('photos', f))
		if (applyForm[0] !== null && applyForm[0] !== undefined)
			formData.append('application', applyForm[0])

		dispatch(editPost({ id: id, post: formData }))
			.then((result) => {
				// const id: number = result.payload.id
				navigate(`/post/${id}`)
			})
			.catch((err) => {
				console.log(err)
				alert('ERROR')
			})
	}

	const onClickToggleModal = useCallback(() => {
		setModalOpen(!modalOpen)
	}, [modalOpen])
	const viewImageModal = useCallback(
		(image: string) => {
			setModalOpen(!modalOpen)
			setClickedImage(image)
		},
		[modalOpen, clickedImage]
	)

	const deleteImageHandler = (imageId: number) => {
		if (postState.selectedPost !== null) {
			const input = {
				id: postState.selectedPost.id,
				photo_id: imageId
			}
			dispatch(deletePostImage(input))
			const newImageUrl = imageUrl.filter((image) => image.id !== imageId)
			setImageUrl(newImageUrl)
		}
	}

	const speciesList: Dictionary<List> = {
		???: [
			'???????????????',
			'?????????',
			'?????????',
			'????????????',
			'??????????????????',
			'?????????',
			'????????????',
			'??????',
			'??????',
			'????????????'
		],
		?????????: [
			'????????? ??????',
			'????????????',
			'??????',
			'?????????',
			'???',
			'?????????',
			'??????????????????',
			'???????????? ?????????',
			'??????????????? ????????????',
			'??????????????????'
		]
	}

	return (
		<Layout>
			<div className='EditContainer'>
				<div className='PostEdit'>
					<button
						id='back-edit-post-button'
						aria-label='back-button'
						onClick={(event) => {
							event.preventDefault()
							navigate('/')
						}}
					>
						<MdArrowBack />
					</button>
					<div>
						<div className='edit-header'>
							<h1>??????????????? ????????????</h1>
						</div>
						<form
							className='edit-post-container'
							onSubmit={editPostHandler}
						>
							<div className='input-container'>
								<label htmlFor='post-title-input'>??????:</label>
								<input
									className='post-input'
									id='post-title-input'
									type='text'
									name='title'
									onChange={(event) =>
										setTitle(event.target.value)
									}
									value={title}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-name-input'>??????:</label>
								<input
									className='post-input'
									id='post-name-input'
									type='text'
									name='name'
									onChange={(event) =>
										setName(event.target.value)
									}
									value={name}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-type-input_input'>
									??????:
								</label>
								<Combobox
									id='post-type-input'
									className='post-combobox'
									name='type'
									data={[
										'???',
										'?????????',
										'???',
										'??????',
										'?????????',
										'??????'
									]}
									onChange={(event) => setAnimalType(event)}
									value={animalType}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-species-input_input'>
									???:
								</label>
								<Combobox
									id='post-species-input'
									className='post-combobox'
									name='species'
									data={
										speciesList[animalType]
											? speciesList[animalType]
											: []
									}
									onChange={(event) => setSpecies(event)}
									value={species}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-age-input'>??????:</label>
								<input
									className='post-input'
									id='post-age-input'
									type='text'
									name='age'
									onChange={(event) =>
										setAge(event.target.value)
									}
									value={age}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-gender-input'>??????:</label>
								<DropdownList
									id='post-gender-input'
									className='post-dropbox'
									name='gender'
									data={['??????', '??????']}
									onChange={(event) => setGender(event)}
									value={gender}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-vaccination-input'>
									?????? ?????? ??????:
								</label>
								<DropdownList
									id='post-vaccination-input'
									className='post-dropbox'
									name='vaccination'
									data={['O', 'X']}
									onChange={(event) => setVaccination(event)}
									value={vaccination}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-neutering-input'>
									????????? ??????:
								</label>
								<DropdownList
									id='post-neutering-input'
									className='post-dropbox'
									name='neutering'
									data={['O', 'X']}
									onChange={(event) => setNeutering(event)}
									value={neutering}
								/>
							</div>
							<div className='content-container'>
								<label htmlFor='post-content-input'>
									????????? ?????? ????????? ???????????????! ????????? ?????????
									????????? ????????? ?????????:&#41;
								</label>
								<textarea
									className='post-input'
									id='post-content-input'
									name='content'
									onChange={(event) =>
										setContent(event.target.value)
									}
									value={content}
								/>
							</div>
							<div className='file-input-container'>
								<div id='photo-title'>??????:</div>
								<div className='photo-input'>
									<div className='current-list'>
										?????? ????????? ??????
										<ul>
											{imageUrl.map((image) => {
												const tempList =
													image.photo_path.split('/')
												const imageName =
													tempList[
														tempList.length - 1
													]
												return (
													<li
														key={`${imageName}_image`}
													>
														<div
															onClick={(e) => {
																e.preventDefault()
																viewImageModal(
																	image.photo_path
																)
															}}
														>
															{imageName}
														</div>
														<button
															className='delete-image-button'
															onClick={(e) => {
																e.preventDefault()
																deleteImageHandler(
																	image.id
																)
															}}
														>
															??????
														</button>
													</li>
												)
											})}
										</ul>
										{modalOpen && (
											<ImageModal
												onClickToggleModal={
													onClickToggleModal
												}
											>
												<img src={clickedImage} />
											</ImageModal>
										)}
									</div>
									<div className='new-input'>
										<label htmlFor='post-photo-input'>
											????????? ????????? ??????
										</label>
										<input
											id='post-photo-input'
											type='file'
											multiple
											name='photo'
											accept='image/*'
											onChange={fileChangedHandler}
										/>
									</div>
								</div>
							</div>
							<div className='file-input-container'>
								<div id='apply-form-title'>???????????????:</div>
								<div className='apply-form-input'>
									<div className='current-apply-form'>
										?????? ????????? ?????? {''}
										<a
											href={`${postState.selectedPost?.form}`}
										>
											??????????????? ??????
										</a>
									</div>
									<div className='new-input'>
										<label htmlFor='post-application-input'>
											??????????????????
										</label>
										<input
											id='post-application-input'
											type='file'
											name='application'
											accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
											onChange={applyFormChangedHandler}
										/>
									</div>
								</div>
							</div>
							<button
								id='confirm-edit-post-button'
								type='submit'
								disabled={
									!!fields.filter((x) => x === '').length
								}
							>
								????????????
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
