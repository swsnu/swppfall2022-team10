import './ReviewDetail.scss'
import Carousel from 'react-bootstrap/Carousel'

export interface IProps {
	title: string
	photo_path: string[]
	author: string
	content: string
}

const ReviewDetail = (props: IProps) => {
	return (
		<div className='ReviewDetail'>
			<div className='review-images'>
				<Carousel interval={null}>
					{props.photo_path.map((path: string) => {
						return (
							<Carousel.Item key={`${path}`}>
								<img src={path} />
							</Carousel.Item>
						)
					})}
				</Carousel>
			</div>
			<div id='header'>
				<h2 id='review-title' className='left'>
					{props.title}
				</h2>
				<p>작성자: {props.author}</p>
			</div>
			<div id='content'>{props.content}</div>
		</div>
	)
}
export default ReviewDetail
