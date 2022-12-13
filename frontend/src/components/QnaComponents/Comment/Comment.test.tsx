import { render, screen } from '@testing-library/react'
import Comment from './Comment'
describe('<Comment />', () => {
	it('should render without errors', () => {
		render(
			<Comment
				author={'COMMENT_AUTHOR'}
				content={'COMMENT_CONTENT'}
				created_at={''}
			/>
		)
		screen.getByText('COMMENT_CONTENT')
		screen.getByText('COMMENT_AUTHOR')
	})
})
