import './Review.scss'
import Card from 'react-bootstrap/Card'

export interface IProps {
	title: string
	photo_path: string[]
	author: string
	clickDetail?: React.MouseEventHandler<HTMLButtonElement>
}

const Review = (props: IProps) => {
	return (
		<div className='Review'>
			<Card style={{ width: '17rem', height: '25rem' }}>
				<Card.Img variant='top' src={props.photo_path[0]} style={{ height: '15rem' }} />
				<Card.Body>
					<Card.Title>{props.title}</Card.Title>
					<Card.Text id='review-author'>
						작성자: {props.author}
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	)
}
export default Review
