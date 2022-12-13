/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useDispatch, useSelector } from 'react-redux'
import './ReviewDetail.scss'
import Carousel from 'react-bootstrap/Carousel'
import { useEffect } from 'react'
import { selectReview, getReview } from '../../../store/slices/review'
import { AppDispatch } from '../../../store'
import { useNavigate } from 'react-router-dom'

export interface IProps {
	id: number
}

const ReviewDetail = (props: IProps) => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const reviewState = useSelector(selectReview)

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dispatch(getReview(props.id))
	}, [])

	return (
		<div className='ReviewDetail'>
			<div className='review-images'>
				<Carousel interval={null}>
					{reviewState.selectedReview?.photo_path.map(
						(path: string) => {
							return (
								<Carousel.Item key={`${path}`}>
									<img src={path} />
								</Carousel.Item>
							)
						}
					)}
				</Carousel>
			</div>
			<div id='header'>
				<h2 id='review-title' className='left'>
					{reviewState.selectedReview?.title}
				</h2>
				<p>작성자: {reviewState.selectedReview?.author_name}</p>
			</div>
			아래 입양게시글을 통해 입양한 후기입니다.
			<div
				className='post-info'
				onClick={() =>
					navigate(`/post/${reviewState.selectedReview?.post.id}`)
				}
			>
				<div id='post-image'>
					<img
						src={reviewState.selectedReview?.post.thumbnail}
						height='100'
					/>
				</div>
				<div id='post-content'>
					<h6>{reviewState.selectedReview?.post.title}</h6>
					종: [{reviewState.selectedReview?.post.animal_type}]{' '}
					{reviewState.selectedReview?.post.species}
					<br />
					나이: {reviewState.selectedReview?.post.age}
				</div>
			</div>
			<br />
			<div id='content'>{reviewState.selectedReview?.content}</div>
		</div>
	)
}
export default ReviewDetail
