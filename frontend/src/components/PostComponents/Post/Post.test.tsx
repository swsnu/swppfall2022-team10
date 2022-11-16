import { render, screen } from '@testing-library/react'
import Post from './Post'
describe('<Post />', () => {
	it('should render without errors if gender is true', () => {
		render(
			<Post
				title={'POST_TITLE'}
				animal_type={'POST_ANIMAL_TYPE'}
				species={'POST_SPECIES'}
				age={1}
				gender={true}
				author={'POST_AUTHOR'}
				photo_path={[]}
				clickDetail={undefined}
			/>
		)
		screen.getByText('POST_TITLE')
		screen.getByText(/POST_ANIMAL_TYPE/)
		screen.getByText(/POST_SPECIES/)
		screen.getByText(/POST_AUTHOR/)
		screen.getByText(/1/)
	})
	it('should render without errors if gender is false', () => {
		const { container } = render(
			<Post
				title={'POST_TITLE'}
				animal_type={'POST_ANIMAL_TYPE'}
				species={'POST_SPECIES'}
				age={1}
				gender={false}
				author={'POST_AUTHOR'}
				photo_path={[]}
				clickDetail={undefined}
			/>
		)
		expect(container).toBeTruthy()
	})
})
