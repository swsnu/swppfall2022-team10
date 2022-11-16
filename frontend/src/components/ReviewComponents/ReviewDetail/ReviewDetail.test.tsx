import { render, screen } from '@testing-library/react'
import ReviewDetail from './ReviewDetail'

describe('<ReviewDetail />', () => {
	it('should render without errors', () => {
		render(
			<ReviewDetail
				title={'REVIEWDETAIL_TITLE'}
				photo_path={['./REVIEWDETAIL_PATH']}
				author={'REVIEWDETAIL_AUTHOR'}
				content={'REVIEWDETAIL_CONTENT'}
			/>
		)
		screen.getByText('REVIEWDETAIL_TITLE')
		screen.getByText(/REVIEWDETAIL_AUTHOR/)
		screen.getByText(/REVIEWDETAIL_CONTENT/)
	})
})
