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
import { MdOutlineAddBox, MdSearch } from 'react-icons/md'

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
	const [searchDate, setSearchDate] = useState<string>('')
	const [searchSpecies, setSearchSpecies] = useState<string>('')
	const [searchAge, setSearchAge] = useState<string>('')
	const [searchGender, setSearchGender] = useState<string>('')
	const [searchClicked, setSearchClicked] = useState<boolean>(false)
	const navigate = useNavigate()

	const postState = useSelector(selectPost)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setLoading(true)

		const ageInt = parseInt(searchAge)
		if (searchAge && (isNaN(ageInt) || ageInt <= 0 || ageInt > 30)) return

		const dateInt = parseInt(searchDate)
		if (searchDate && (isNaN(dateInt) || dateInt <= 0)) return

		const data = {
			animal_type: searchAnimalType ? searchAnimalType : headerAnimalType,
			date: searchDate ? [dateInt] : null,
			species: searchSpecies,
			age: searchAge ? [ageInt] : null,
			gender: searchGender ? searchGender === '수컷' : null
		}
		console.log(data)

		// dispatch(getPosts(currentPage, data)).then((result) => {
		dispatch(getPosts(currentPage)).then((result) => {
			const pageResult = result.payload
			if (pageResult) {
				// setPostList(pageResult.results)
				setPostCount(pageResult.count)
				setNextPage(pageResult.next)
				setPrevPage(pageResult.prev)
			}
		})
		setLoading(false)

		// setSearchAnimalType('')
		// setSearchSpecies('')
		// setSearchDate('')
		// setSearchAge('')
		// setSearchGender('')
	}, [currentPage, headerAnimalType, searchClicked])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setHeaderAnimalType(postState.selectedAnimal)
		setCurrentPage(1)
		setSearchAnimalType('')
		setSearchSpecies('')
		setSearchDate('')
		setSearchAge('')
		setSearchGender('')
	}, [postState.selectedAnimal])

	const searchPostHandler = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault()
		setCurrentPage(1)
		setSearchClicked((current) => !current)
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
							<input
								className='type-space'
								placeholder='보호 기간'
								onChange={(event) =>
									setSearchDate(event.target.value)
								}
								value={searchDate}
							/>
						</div>
						<div className='category age-container'>
							<div className='title'>나이</div>
							<input
								className='type-space'
								placeholder='나이'
								onChange={(event) =>
									setSearchAge(event.target.value)
								}
								value={searchAge}
							/>
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
					paginate={setCurrentPage}
				></Pagination>
			</div>
		</Layout>
	)
}
