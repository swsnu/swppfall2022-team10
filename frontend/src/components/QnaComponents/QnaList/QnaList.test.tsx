/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { qnaState } from '../../../store/slices/qna'
import { getMockStore } from '../../../test-utils/mock'
import QnaList from './QnaList'
import { IProps as QnaProps } from '../Qna/Qna'
import assert from 'assert'

jest.mock('../Qna/Qna', () => (props: QnaProps) => (
    <div data-testid='spyQna'>
        <div className='qna-row'>
            <div>{props.id}</div>
            <div>{props.title}</div>
            <div>{props.created_at}</div>
            <div>{props.hits}</div>
        </div>
    </div >

))

const stubInitialState: qnaState = {
    qnas: [
        {
            id: 1,
            author_id: 2,
            author_name: "QNA_AUTHOR_NAME",
            title: "QNA_TITLE",
            content: "QNA_CONTENT",
            created_at: "QNA_CREATED_AT",
            hits: 3,
        }
    ],
    selectedQna: null,
}

const mockStore = getMockStore({
    qna: stubInitialState,
    post: { posts: [], selectedPost: null, selectedAnimal: '' },
    user: { users: [], currentUser: null, logged_in: false },
    review: { reviews: [], selectedReview: null, selectedAnimal: '' },
    application: { applications: [], selectedApplication: null },
})

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch
}))

const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<QnaList />', () => {
    let qnaList: JSX.Element
    beforeEach(() => {
        jest.clearAllMocks()
        qnaList = (
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path='/' element={<QnaList />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        )
    })
    it('should render QnaList', async () => {
        const { container } = render(qnaList)
        expect(container).toBeTruthy()
        await screen.findByText('동물이 밥을 먹지 않아요.')
        await screen.findByText('동물이 우울해 해요.')
        await screen.findByText('동물이 아파요.')
        await screen.findByText('동물이 자지 않아요.')
    })
    // it('should render qnas', () => {
    //     render(qnaList)
    //     const qnas = screen.queryByTestId('spyQna')
    //     expect(qnas).toHaveLength(1)
    // })
    // it('should handle clickDetail', () => {
    //     render(qnaList)
    //     const qnas = screen.getAllByTestId('spyQna')
    //     const qna = qnas[0]
    //     const button = qna.querySelector('.qna-row')
    //     assert(button !== null)
    //     fireEvent.click(button)
    //     expect(mockNavigate).toHaveBeenCalledTimes(1)
    // })
    it('should handle createQnaButton', () => {
        render(qnaList)
        const createQnaButton = document.querySelector('#create-qna-button')
        assert(createQnaButton !== null)
        fireEvent.click(createQnaButton)
        expect(mockNavigate).toHaveBeenCalledTimes(1)
    })
})
