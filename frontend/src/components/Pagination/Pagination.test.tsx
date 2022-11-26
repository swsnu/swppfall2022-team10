import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Pagination from './Pagination'

const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

describe('<Pagination />', () => {
	it('should render pages without errors: case 1', () => {
		render(
			<Pagination
				itemsPerPage={1}
				totalItems={10}
				currentPage={1}
				paginate={(number) => null}
			/>
		)
		for (let i = 1; i <= 9; i++) screen.getByText(String(i))
		expect(screen.queryByText('10')).not.toBeInTheDocument()
	})
	it('should render pages without errors: case 2', () => {
		render(
			<Pagination
				itemsPerPage={1}
				totalItems={12}
				currentPage={10}
				paginate={(number) => null}
			/>
		)
		for (let i = 4; i <= 12; i++) screen.getByText(String(i))
		expect(screen.queryByText('3')).not.toBeInTheDocument()
	})
	it('should render pages without errors: case 3', () => {
		render(
			<Pagination
				itemsPerPage={1}
				totalItems={12}
				currentPage={7}
				paginate={(number) => null}
			/>
		)
		for (let i = 3; i <= 11; i++) screen.getByText(String(i))
		expect(screen.queryByText('12')).not.toBeInTheDocument()
	})
	it('should go to previous page when prev button clicked', async () => {
		const baseProps = {
			itemsPerPage: 1,
			totalItems: 10,
			currentPage: 2,
			paginate: jest.fn()
		}
		render(<Pagination {...baseProps} />)
		const prevButton = screen.getByText('<')
		fireEvent.click(prevButton)
		await waitFor(() => {
			expect(baseProps.paginate).toHaveBeenCalledWith(1)
		})
	})
	it('should not go to previous page when at first page', async () => {
		const baseProps = {
			itemsPerPage: 1,
			totalItems: 10,
			currentPage: 1,
			paginate: jest.fn()
		}
		render(<Pagination {...baseProps} />)
		const prevButton = screen.getByText('<')
		fireEvent.click(prevButton)
		await waitFor(() => {
			expect(baseProps.paginate).not.toHaveBeenCalled()
		})
	})
	it('should go to certain page when page button clicked', async () => {
		const baseProps = {
			itemsPerPage: 1,
			totalItems: 10,
			currentPage: 1,
			paginate: jest.fn()
		}
		render(<Pagination {...baseProps} />)
		const prevButton = screen.getByText('5')
		fireEvent.click(prevButton)
		await waitFor(() => {
			expect(baseProps.paginate).toHaveBeenCalledWith(5)
		})
	})
	it('should go to next page when next button clicked', async () => {
		const baseProps = {
			itemsPerPage: 1,
			totalItems: 10,
			currentPage: 1,
			paginate: jest.fn()
		}
		render(<Pagination {...baseProps} />)
		const prevButton = screen.getByText('>')
		fireEvent.click(prevButton)
		await waitFor(() => {
			expect(baseProps.paginate).toHaveBeenCalledWith(2)
		})
	})
	it('should not go to next page when at last page', async () => {
		const baseProps = {
			itemsPerPage: 1,
			totalItems: 10,
			currentPage: 10,
			paginate: jest.fn()
		}
		render(<Pagination {...baseProps} />)
		const prevButton = screen.getByText('>')
		fireEvent.click(prevButton)
		await waitFor(() => {
			expect(baseProps.paginate).not.toHaveBeenCalled()
		})
	})
})
