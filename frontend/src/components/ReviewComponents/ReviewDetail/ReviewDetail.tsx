import './ReviewDetail.scss'
import Carousel from 'react-bootstrap/Carousel';

export interface IProps {
	title: string
	photo_path: string[]
	author: string
}

const ReviewDetail = (props: IProps) => {

	return (
		<div className='ReviewDetail'>
		    <div className='review-images'>
                <Carousel>
                    {props.photo_path.map((path:string) => {
					    return (
						    <Carousel.Item>
                                <img
                                    src={path}
                                />
                            </Carousel.Item>
					    )
					})}
			    </Carousel>
			</div>
		    <h2 id='review-title' className='left'>
				{props.title}
			</h2>
			<p>
				작성자: {props.author}
			</p>
		</div>
	)
}
export default ReviewDetail