/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { getPost, editPost, selectPost, postCreateType } from '../../../store/slices/post'
import { selectUser } from '../../../store/slices/user'
import { MdArrowBack } from 'react-icons/md'
import Combobox from "react-widgets/Combobox";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/scss/styles.scss";
import './PostEdit.scss'
import { Dictionary } from '@reduxjs/toolkit'
import { List } from 'reselect/es/types'

export default function PostCreate() {
	const { id } = useParams();

	const [title, setTitle] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [animalType, setAnimalType] = useState<string>('')
	const [species, setSpecies] = useState<string>('')
	const [age, setAge] = useState<string>('')
	const [gender, setGender] = useState<string>('')
	const [vaccination, setVaccination] = useState<string>('')
	const [neutering, setNeutering] = useState<string>('')
	const [character, setCharacter] = useState<string>('')
	const [file, setFile] = useState<{}>({ selectedFiles: null })

	const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
	const postState = useSelector(selectPost);

	useEffect(() => {
		dispatch(getPost(Number(id)));
		const currentPost = postState.posts.find((post) => {
			return post.id === Number(id);
		});
		if (currentPost) {
			setTitle(currentPost.title);
			setName(currentPost.name);
			setAnimalType(currentPost.animal_type);
			setSpecies(currentPost.species);
			setAge(String(currentPost.age));
			setGender(currentPost.gender ? '수컷' : '암컷');
			setVaccination(currentPost.vaccination ? 'O' : 'X');
			setNeutering(currentPost.neutering ? 'O' : 'X');
			setCharacter(currentPost.character);
			setFile(currentPost.photo_path);
		}
	}, [id]);

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		console.log(files)
		setFile({
			selectedFiles: files
		})
	}

	const createPostHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		console.log('createPost')
		event.preventDefault()
		const data = {
			title: title,
			name: name,
			animal_type: animalType,
			species: species,
			age: age,
			gender: gender==='수컷' ? true : false,
			neutering: neutering==='O' ? true : false,
			vaccination: vaccination==='O' ? true : false,
			character: character,
			photo_path: [],
			author_id: 0,
		};
        console.log(data)
		// const result = await dispatch(editPost(data));
		// if (result.type === `${editPost.typePrefix}/fulfilled`) {
		// 	navigate(`/posts/${result.payload.id}`);
		// } else {
		// 	alert("Error on edit Post");
		// }
	}

    const speciesList: Dictionary<List> = {
		"개": ['포메라니안', '치와와', '파피용', '닥스훈트', '요크셔테리어', '말티즈', '슈나우저','시츄', '푸들', '웰시코기'],
		"고양이":['러시안 블루', '페르시안', '뱅갈', '봄베이', '샴', '메인쿤', '스코티쉬폴드', '아메리칸 숏헤이', '캘리포니아 스팽글드', '이집트안마우']
	}
	
	return (
		<Layout>
			<div className='CreateContainer'>
				<div className='PostCreate'>
					<button	
						id='back-create-post-button'
						onClick={(event) => {
							event.preventDefault()
							navigate('/')
						}}
					>
						<MdArrowBack />
					</button>
					<div>
						<div className='create-header'>
							<h1>입양게시글 수정하기</h1>
						</div>
						<form
							className='create-post-container'
							onSubmit={createPostHandler}
						>
							<div className='input-container'>
								<label htmlFor='post-title-input'>제목:</label>
								<input
									className='post-input'
									id='post-title-input'
									type='text'
									name='title'
                                    onChange={event => setTitle(event.target.value)}
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
                                    onChange={event => setName(event.target.value)}
                                    value={name}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-type-input'>동물:</label>
								<Combobox
									id='post-type-input'
									className='post-combobox'
									name='type'
									data={["개", "고양이", "새", "토끼", "거북이", "기타"]}
                                    onChange={event => setAnimalType(event)}
                                    value={animalType}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-species-input'>종:</label>
								<Combobox
									id='post-species-input'
									className='post-combobox'
									name='species'
									data={speciesList[animalType] ? speciesList[animalType] : []}
                                    onChange={event => setSpecies(event)}
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
									onChange={event => setAge(event.target.value)}
                                    value={age}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-gender-input'>성별:</label>
								<DropdownList
									id='post-gender-input'
									className='post-dropbox'
									name='gender'
									data={["암컷", "수컷"]}
									onChange={event => setGender(event)}
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
									data={["O", "X"]}
									onChange={event => setVaccination(event)}
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
									data={["O", "X"]}
									onChange={event => setNeutering(event)}
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
									onChange={event => setCharacter(event.target.value)}
                                    value={character}
								/>
							</div>
							<div className='input-container'>
								<label htmlFor='post-age-input'>사진:</label>
								<input
									id='post-photo-input'
									type='file'
									multiple
									name='photo'
									accept='image/*'
									onChange={fileChangedHandler}
								/>
							</div>
							<button
								id='confirm-create-post-button'
								type='submit'
								// disabled={!(title && name && animalType && species && age 
                                //     && gender && vaccination && neutering && character)}
							>
								게시하기
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
	// }
}