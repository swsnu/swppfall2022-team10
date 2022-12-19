/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { qnaState } from '../../../store/slices/qna'
import { getMockStore } from '../../../test-utils/mock'
import CommentList from './CommentList'
import { IProps as CommentProps } from '../Comment/Comment'
import axios from 'axios'
import assert from 'assert'
import { act } from 'react-dom/test-utils'

jest.mock('../Comment/Comment', () => (props: CommentProps) => (
	<div data-testid='spyComment'>
		<div className='comment-row'>
			<div>{props.author}</div>
			<div>{props.content}</div>
			<div>{props.created_at}</div>
		</div>
	</div>
))

const stubInitialState: qnaState = {
	qnas: [
		{
			id: 1,
			author_id: 2,
			author_name: 'QNA_AUTHOR_NAME',
			title: 'QNA_TITLE',
			content: 'QNA_CONTENT',
			created_at: 'QNA_CREATED_AT',
			hits: 3,
			editable: false,
			comments: [
				{
					id: 1,
					author_id: 1,
					author_name: 'COMMENT_AUTHOR_NAME',
					content: 'COMMENT_CONTENT',
					created_at: 'COMMENT_CREATED_AT',
					editable: false
				}
			]
		}
	],
	selectedQna: {
		id: 1,
		author_id: 2,
		author_name: 'QNA_AUTHOR_NAME',
		title: 'QNA_TITLE',
		content: 'QNA_CONTENT',
		created_at: 'QNA_CREATED_AT',
		hits: 3,
		editable: false,
		comments: [
			{
				id: 1,
				author_id: 1,
				author_name: 'COMMENT_AUTHOR_NAME',
				content: 'COMMENT_CONTENT',
				created_at: 'COMMENT_CREATED_AT',
				editable: false
			}
		]
	}
}

const mockStore = getMockStore({
	qna: stubInitialState,
	post: { posts: [], selectedPost: null, selectedAnimal: '' },
	review: { reviews: [], selectedReview: null, selectedAnimal: '' },
	application: { applications: [], selectedApplication: null },
	mypost: { posts: [], likes: [], applys: [], reviews: [], qnas: [] }
})

const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<CommentList />', () => {
	let commentList: JSX.Element
	beforeEach(() => {
		jest.clearAllMocks()
		jest.spyOn(axios, 'get').mockResolvedValue({
			data: {
				id: 1,
				author_id: 2,
				author_name: 'QNA_AUTHOR_NAME',
				title: 'QNA_TITLE',
				content: 'QNA_CONTENT',
				created_at: 'QNA_CREATED_AT',
				hits: 3,
				editable: false,
				comments: [
					{
						id: 1,
						author_id: 1,
						author_name: 'COMMENT_AUTHOR_NAME',
						content: 'COMMENT_CONTENT',
						created_at: 'COMMENT_CREATED_AT',
						editable: false
					}
				]
			}
		})
		commentList = (
			<Provider store={mockStore}>
				<MemoryRouter>
					<Routes>
						<Route path='/' element={<CommentList />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		)
	})
	it('should render CommentList', async () => {
		await act(() => {
			const { container } = render(commentList)
			expect(container).toBeTruthy()
		})

		await screen.findByText('COMMENT_AUTHOR_NAME')
		await screen.findByText('COMMENT_CONTENT')
		await screen.findByText('COMMENT_CREATED_AT')
	})
	/* it('should render comments', async () => {
		await act(() => {
			render(commentList)
		})
		const comments = screen.getAllByTestId('spyComment')
		expect(comments).toHaveLength(1)
	}) */
})
