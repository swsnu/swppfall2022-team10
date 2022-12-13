import { render, screen } from '@testing-library/react'
import Review from './Review'
describe('<Review />', () => {
	it('should render without errors', () => {
		render(
			<Review
				title={'REVIEW_TITLE'}
				author={'REVIEW_AUTHOR'}
				thumbnail={''}
				clickDetail={undefined}
			/>
		)
		screen.getByText('REVIEW_TITLE')
		screen.getByText(/REVIEW_AUTHOR/)
	})
})
