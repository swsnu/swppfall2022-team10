/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { createPost, postCreateType } from '../../../store/slices/post'
import { checkLogin } from '../../../store/slices/user'
import { MdArrowBack } from 'react-icons/md'
import Combobox from 'react-widgets/Combobox'
import NumberPicker from 'react-widgets/NumberPicker'
import DropdownList from 'react-widgets/DropdownList'
import 'react-widgets/scss/styles.scss'
import './PostCreate.scss'
import { Dictionary } from '@reduxjs/toolkit'
import { List } from 'reselect/es/types'

export default function PostCreate() {
	const [loading, setLoading] = useState<boolean>(true)
	const [title, setTitle] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [animalType, setAnimalType] = useState<string>('')
	const [species, setSpecies] = useState<string>('')
	const [age, setAge] = useState<string>('')
	const [gender, setGender] = useState<string>('')
	const [vaccination, setVaccination] = useState<string>('')
	const [neutering, setNeutering] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [file, setFile] = useState<File[]>([])
	const [applyForm, setApplyForm] = useState<File[]>([])

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(checkLogin()).then((result) => {
			const loggedIn: boolean = (result.payload as { logged_in: boolean })
				.logged_in
			setLoading(!loggedIn)
			if (!loggedIn) {
				alert('You should log in')
				navigate('/login')
			}
		})
	}, [])

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
		console.log(event.target.files)
		if (files !== null) setFile(file.concat(Array.from(files)))
	}

	const applyFormChangedHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const applyForms = event.target.files
		if (applyForms !== null) setApplyForm([applyForms[0]])
	}

	const createPostHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// const emptyField = fields.filter((x) => x === '')
		// if (emptyField.length !== 0) return

		// if (file.length === 0) return
		// if (applyForm.length === 0) return

		// const ageInt = parseInt(age)
		// if (isNaN(ageInt) || ageInt <= 0 || ageInt > 30) return

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
		formData.append('application', applyForm[0])

		dispatch(createPost(formData))
			.then((result) => {
				const id: number = result.payload.id
				navigate(`/post/${id}`)
			})
			.catch((err) => {
				console.log(err)
				alert('ERROR')
			})
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
			{!loading ? (
				<div className='CreateContainer'>
					<div className='PostCreate'>
						<button
							id='back-create-post-button'
							aria-label='back-button'
							onClick={(event) => {
								event.preventDefault()
								navigate('/')
							}}
						>
							<MdArrowBack />
						</button>
						<div>
							<div className='create-header'>
								<h1>??????????????? ?????????</h1>
							</div>
							<form
								className='create-post-container'
								onSubmit={createPostHandler}
							>
								<div className='input-container'>
									<label htmlFor='post-title-input'>
										??????:
									</label>
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
									<label htmlFor='post-name-input'>
										??????:
									</label>
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
										onChange={(event) =>
											setAnimalType(event)
										}
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
									<label htmlFor='post-age-input'>
										??????:
									</label>
									<NumberPicker
										className='type-space post-dropbox'
										id='post-age-input'
										value={parseInt(age)}
										onChange={(value) =>
											setAge(String(value))
										}
										name='age'
										defaultValue={0}
										min={0}
										max={30}
									/>
									{/* <input
									className='post-input'
									id='post-age-input'
									type='text'
									name='age'
									onChange={(event) =>
										setAge(event.target.value)
									}
									value={age}
								/> */}
								</div>
								<div className='input-container'>
									<label htmlFor='post-gender-input'>
										??????:
									</label>
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
										onChange={(event) =>
											setVaccination(event)
										}
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
										onChange={(event) =>
											setNeutering(event)
										}
										value={neutering}
									/>
								</div>
								<div className='content-container'>
									<label htmlFor='post-content-input'>
										????????? ?????? ????????? ???????????????! ?????????
										????????? ????????? ????????? ?????????:&#41;
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
								<div className='input-container'>
									<label htmlFor='post-photo-input'>
										??????:
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
								<div id='apply-form-container'>
									<div className='input-container'>
										<label htmlFor='post-application-input'>
											??????????????? ??????:
										</label>
										<input
											id='post-application-input'
											type='file'
											name='application'
											accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
											onChange={applyFormChangedHandler}
										/>
									</div>
									<span id='apply-form-text'>
										??????????????? ?????? ?????????{' '}
										<a href='/introduction'>
											???????????? ??????
										</a>
										?????? ????????? ??? ????????????.
									</span>
								</div>
								<button
									id='confirm-create-post-button'
									type='submit'
									disabled={
										!(
											!fields.filter((x) => x === '')
												.length &&
											file.length &&
											applyForm.length
										)
									}
								>
									????????????
								</button>
							</form>
						</div>
					</div>
				</div>
			) : (
				<div>Loading...</div>
			)}
		</Layout>
	)
}
