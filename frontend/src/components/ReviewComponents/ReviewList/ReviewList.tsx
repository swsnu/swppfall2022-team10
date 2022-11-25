/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Layout from '../../Layout/Layout'

import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Review from '../Review/Review'
import {
	getReviews,
	reviewType,
	selectReview
} from '../../../store/slices/review'
import { AppDispatch } from '../../../store'
import { MdOutlineAddBox } from 'react-icons/md'
import './ReviewList.scss'
import ReviewModal from '../ReviewModal/ReviewModal'
import ReviewDetail from '../ReviewDetail/ReviewDetail'
import Pagination from '../../Pagination/Pagination'

export default function ReviewList() {
	const [loading, setLoading] = useState<boolean>(false)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [reviewsPerPage, setReviewsPerPage] = useState<number>(20)
	const [reviewCount, setReviewCount] = useState<number>(0)

	const [headerAnimalType, setHeaderAnimalType] = useState<string>('')

	const navigate = useNavigate()
	const reviewState = useSelector(selectReview)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		setLoading(true)

		const data = {
			page: currentPage,
			animal_type: headerAnimalType !== '' ? headerAnimalType : null
		}

		dispatch(getReviews(data)).then((result) => {
			// dispatch(getPosts(currentPage)).then((result) => {
			const pageResult = result.payload
			if (pageResult) {
				setReviewCount(pageResult.count)
			}
		})
		setLoading(false)
	}, [currentPage, headerAnimalType])
	// console.log(reviewState.reviews)

	useEffect(() => {
		setHeaderAnimalType(reviewState.selectedAnimal)
		setCurrentPage(1)
	}, [reviewState.selectedAnimal])

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const onClickToggleModal = useCallback(() => {
		setModalOpen(!modalOpen)
	}, [modalOpen])
	const [clickedReview, setClickedReview] = useState<reviewType>(
		reviewState.reviews[0]
	)
	const onClickReview = useCallback(
		(review: reviewType) => {
			setModalOpen(!modalOpen)
			setClickedReview(review)
		},
		[modalOpen, clickedReview]
	)

	return (
		<Layout>
			<div className='ReviewListContainer'>
				<div className='ReviewList'>
					<div className='reviews'>
						{reviewState.reviews.map((review: reviewType) => {
							return (
								<button
									className='review-container'
									onClick={() => onClickReview(review)}
									key={`${review.id}`}
								>
									<Review
										key={`${review.id}_review`}
										title={review.title}
										photo_path={review.photo_path}
										author={review.author_name}
									/>
								</button>
							)
						})}
						{modalOpen && (
							<ReviewModal
								onClickToggleModal={onClickToggleModal}
							>
								<ReviewDetail
									key={`${clickedReview.id}_review`}
									title={clickedReview.title}
									photo_path={clickedReview.photo_path}
									author={clickedReview.author_name}
									content={clickedReview.content}
								/>
							</ReviewModal>
						)}
					</div>
					<div className='create-review'>
						<button
							id='create-review-button'
							onClick={() => navigate('/reviews/create')}
						>
							<MdOutlineAddBox size='50' />
						</button>
					</div>
				</div>
				<Pagination
					itemsPerPage={reviewsPerPage}
					totalItems={reviewCount}
					currentPage={currentPage}
					paginate={setCurrentPage}
				></Pagination>
			</div>
		</Layout>
	)
}
