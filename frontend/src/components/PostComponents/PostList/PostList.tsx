/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Post from '../Post/Post'
import { getPosts, postType, selectPost } from '../../../store/slices/post'
import { AppDispatch } from '../../../store'
import {
	MdOutlineAddBox,
	MdSearch,
	MdCheckBoxOutlineBlank,
	MdCheckBox
} from 'react-icons/md'
import NumberPicker from 'react-widgets/NumberPicker'

import Button from 'react-bootstrap/Button'

import './PostList.scss'
import Pagination from './Pagination/Pagination'

export default function PostList() {
	// const [postList, setPostList] = useState<postType[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [postsPerPage, setPostsPerPage] = useState<number>(20)
	const [postCount, setPostCount] = useState<number>(0)
	const [nextPage, setNextPage] = useState<string>('')
	const [prevPage, setPrevPage] = useState<string>('')

	const [headerAnimalType, setHeaderAnimalType] = useState<string>('')
	const [searchAnimalType, setSearchAnimalType] = useState<string>('')
	const [searchMinDate, setSearchMinDate] = useState<number | null>(null)
	const [searchMaxDate, setSearchMaxDate] = useState<number | null>(null)
	const [searchSpecies, setSearchSpecies] = useState<string>('')
	const [searchMinAge, setSearchMinAge] = useState<number | null>(null)
	const [searchMaxAge, setSearchMaxAge] = useState<number | null>(null)
	const [searchGender, setSearchGender] = useState<string>('')
	const [searchActive, setSearchActive] = useState<boolean>(false)

	const navigate = useNavigate()
	const postState = useSelector(selectPost)
	const dispatch = useDispatch<AppDispatch>()

	const filterPostHandler = () => {
		setLoading(true)

		// const searchDate = searchMinDate
		// 	? searchMaxDate
		// 		? searchMinDate === searchMaxDate
		// 			? [searchMinDate]
		// 			: [searchMinDate, searchMaxDate]
		// 		: [null, searchMaxDate]
		// 	: searchMaxDate
		// 	? [searchMinDate, null]
		// 	: null
		//
		// const searchAge = searchMinAge
		// 	? searchMaxAge
		// 		? searchMinAge === searchMaxAge
		// 			? [searchMinAge]
		// 			: [searchMinAge, searchMaxAge]
		// 		: [null, searchMaxAge]
		// 	: searchMaxAge
		// 	? [searchMinAge, null]
		// 	: null

		const animalType =
			searchAnimalType !== ''
				? searchAnimalType
				: headerAnimalType !== ''
				? headerAnimalType
				: null

		const data = {
			page: currentPage,
			animal_type: animalType,
			date: searchMinDate === searchMaxDate ? searchMinDate : null,
			date_min: searchMinDate,
			date_max: searchMaxDate,
			age: searchMinAge === searchMaxAge ? searchMinAge : null,
			age_min: searchMinAge,
			age_max: searchMaxAge,
			species: searchSpecies !== '' ? searchSpecies : null,
			gender: searchGender ? searchGender === '수컷' : null,
			is_active: searchActive
		}

		dispatch(getPosts(data)).then((result) => {
			// dispatch(getPosts(currentPage)).then((result) => {
			const pageResult = result.payload
			if (pageResult) {
				// setPostList(pageResult.results)
				setPostCount(pageResult.count)
				setNextPage(pageResult.next)
				setPrevPage(pageResult.prev)
			}
		})
		setLoading(false)
	}

	useEffect(() => {
		filterPostHandler()
	}, [currentPage, headerAnimalType, searchActive])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setHeaderAnimalType(postState.selectedAnimal)
		setCurrentPage(1)
		setSearchAnimalType('')
		setSearchSpecies('')
		setSearchMinDate(null)
		setSearchMaxDate(null)
		setSearchMinAge(null)
		setSearchMaxAge(null)
		setSearchGender('')
		setSearchActive(false)
	}, [postState.selectedAnimal])

	const searchPostHandler = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault()
		setCurrentPage(1)
		filterPostHandler()
	}

	return (
		<Layout>
			<div className='ListContainer'>
				<div className='PostList'>
					<div className='user-input-container'>
						{postState.selectedAnimal === '개' ||
						postState.selectedAnimal === '고양이' ? (
							<div className='category animal-container'>
								<div className='title'>종</div>
								<input
									className='type-space'
									placeholder='종'
									onChange={(event) =>
										setSearchSpecies(event.target.value)
									}
									value={searchSpecies}
								/>
							</div>
						) : (
							<div className='category animal-container'>
								<div className='title'>동물</div>
								<input
									className='type-space'
									placeholder='동물'
									onChange={(event) =>
										setSearchAnimalType(event.target.value)
									}
									value={searchAnimalType}
								/>
							</div>
						)}

						<div className='category date-container'>
							<div className='title'>보호 기간</div>
							<div className='number-picker-wrapper'>
								<NumberPicker
									className='type-space'
									placeholder='최소'
									onChange={(value) =>
										setSearchMinDate(value)
									}
									min={0}
									max={
										searchMaxDate
											? searchMaxDate
											: undefined
									}
								/>
								<NumberPicker
									className='type-space'
									placeholder='최대'
									onChange={(value) =>
										setSearchMaxDate(value)
									}
									min={searchMinDate ? searchMinDate : 0}
								/>
							</div>
						</div>
						<div className='category age-container'>
							<div className='title'>나이</div>
							<div className='number-picker-wrapper'>
								<NumberPicker
									className='type-space'
									placeholder='최소'
									onChange={(value) => setSearchMinAge(value)}
									min={0}
									max={searchMaxAge ? searchMaxAge : 30}
								/>
								<NumberPicker
									className='type-space'
									placeholder='최대'
									onChange={(value) => setSearchMaxAge(value)}
									min={searchMinAge ? searchMinAge : 0}
									max={30}
								/>
							</div>
						</div>
						<div className='category sex-container'>
							<div className='title'>성별</div>
							<input
								className='type-space'
								placeholder='성별'
								onChange={(event) =>
									setSearchGender(event.target.value)
								}
								value={searchGender}
							/>
						</div>
						<div className='search-button'>
							<Button
								id='search-button'
								variant='outline-success'
								onClick={searchPostHandler}
							>
								<MdSearch size={20} />
							</Button>
						</div>
					</div>
					{searchActive ? (
						<div className='user-input-checkbox'>
							<MdCheckBox
								size='20'
								onClick={() => setSearchActive(false)}
							/>
							<span>&lsquo;입양신청 진행 중&lsquo;만 표시</span>
						</div>
					) : (
						<div className='user-input-checkbox'>
							<MdCheckBoxOutlineBlank
								size='20'
								onClick={() => setSearchActive(true)}
							/>
							<span>&lsquo;입양신청 진행 중&lsquo;만 표시</span>
						</div>
					)}
					<div className='posts'>
						{loading && <div> loading... </div>}
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
				<Pagination
					postsPerPage={postsPerPage}
					totalPosts={postCount}
					currentPage={currentPage}
					paginate={setCurrentPage}
				></Pagination>
			</div>
		</Layout>
	)
}
