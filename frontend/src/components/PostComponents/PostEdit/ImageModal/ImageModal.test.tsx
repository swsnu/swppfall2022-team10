import { fireEvent, render, screen } from '@testing-library/react'
import ImageModal from './ImageModal'

const alert = jest.fn()
global.alert = alert

describe('<ImageModal />', () => {
	it('should render without errors', () => {
		render(
			<ImageModal
				onClickToggleModal={() => {
					alert('closed')
				}}
			>
				<div>childComponent</div>
			</ImageModal>
		)
		screen.getByText('childComponent')
	})
	it('should call onClickToggleModal', () => {
		render(
			<ImageModal
				onClickToggleModal={() => {
					alert('closed')
				}}
			>
				<div>childComponent</div>
			</ImageModal>
		)
		const button = screen.getByRole('button')
		fireEvent.click(button)
		expect(alert).toHaveBeenCalledWith('closed')
	})
})
