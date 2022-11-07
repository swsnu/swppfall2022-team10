/* eslint-disable @typescript-eslint/no-floating-promises */
import Layout from '../../Layout/Layout'

import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Review from '../Review/Review'
import {
	getReviews,
	reviewType,
	selectReview
} from '../../../store/slices/review'
import { AppDispatch } from '../../../store'
import { MdFilterList, MdOutlineAddBox } from 'react-icons/md'
import './ReviewList.scss'
import Modal from "../ReviewModal/ReviewModal"
import ReviewDetail from '../ReviewDetail/ReviewDetail'

export default function ReviewList() {
	const navigate = useNavigate()

	const reviewState = useSelector(selectReview)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(getReviews())
	}, [])

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const onClickToggleModal = useCallback(() => {
        setModalOpen(!modalOpen);
    }, [modalOpen]);
    const [clickedReview, setClickedReview] = useState<reviewType>(reviewState.reviews[0])
    const onClickReview = useCallback((review: reviewType) => {
        setModalOpen(!modalOpen);
        setClickedReview(review)
    }, [modalOpen, clickedReview]);

	return (
		<Layout>
			<div className='ListContainer'>
				<div className='ReviewList'>
					<div id='list-filter-button'>
						<MdFilterList size='25' />
					</div>
					<div className='reviews'>
						{reviewState.reviews.map((review: reviewType) => {
							return (
							    <button className = 'review-container' onClick={()=>onClickReview(review)}>
								    <Review
									    key={`${review.id}_review`}
									    title={review.title}
									    photo_path={review.photo_path}
									    author={review.author_name}
								    />
								</button>
							)
						})}
						{modalOpen && (<Modal onClickToggleModal={onClickToggleModal}>
						    <ReviewDetail key={`${clickedReview.id}_review`}
									    title={clickedReview.title}
									    photo_path={clickedReview.photo_path}
									    author={clickedReview.author_name}/>
						</Modal>)}
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
			</div>
		</Layout>
	)
}
