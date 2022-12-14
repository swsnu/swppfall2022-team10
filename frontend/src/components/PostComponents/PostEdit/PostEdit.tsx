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
				setGender(currentPost.gender ? '수컷' : '암컷')
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
			gender: gender === '수컷',
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
		개: [
			'포메라니안',
			'치와와',
			'파피용',
			'닥스훈트',
			'요크셔테리어',
			'말티즈',
			'슈나우저',
			'시츄',
			'푸들',
			'웰시코기'
		],
		고양이: [
			'러시안 블루',
			'페르시안',
			'뱅갈',
			'봄베이',
			'샴',
			'메인쿤',
			'스코티쉬폴드',
			'아메리칸 숏헤이',
			'캘리포니아 스팽글드',
			'이집트안마우'
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
							<h1>입양게시글 수정하기</h1>
						</div>
						<form
							className='edit-post-container'
							onSubmit={editPostHandler}
						>
							<div className='input-container'>
								<label htmlFor='post-title-input'>제목:</label>
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
								<label htmlFor='post-name-input'>이름:</label>
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
									동물:
								</label>
								<Combobox
									id='post-type-input'
									className='post-combobox'
									name='type'
									data={[
										'개',
										'고양이',
										'새',
										'토끼',
										'거북이',
										'기타'
									]}
									onChange={(event) => setAnimalType(event)}
									value={animalType}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-species-input_input'>
									종:
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
								<label htmlFor='post-age-input'>나이:</label>
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
								<label htmlFor='post-gender-input'>성별:</label>
								<DropdownList
									id='post-gender-input'
									className='post-dropbox'
									name='gender'
									data={['암컷', '수컷']}
									onChange={(event) => setGender(event)}
									value={gender}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-vaccination-input'>
									백신 접종 여부:
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
									중성화 여부:
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
									동물에 대해 추가로 알려주세요! 자세한 설명은
									입양에 도움이 됩니다:&#41;
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
								<div id='photo-title'>사진:</div>
								<div className='photo-input'>
									<div className='current-list'>
										현재 등록된 사진
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
															삭제
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
											추가로 등록할 사진
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
								<div id='apply-form-title'>입양신청서:</div>
								<div className='apply-form-input'>
									<div className='current-apply-form'>
										현재 등록된 파일 {''}
										<a
											href={`${postState.selectedPost?.form}`}
										>
											입양신청서 서식
										</a>
									</div>
									<div className='new-input'>
										<label htmlFor='post-application-input'>
											재업로드하기
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
								수정하기
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
