/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import QnaCreate from './QnaCreate'
import { getMockStore } from '../../../test-utils/mock'
import { Provider } from 'react-redux'
import * as reviewSlice from '../../../store/slices/review'
import { MdArrowBack } from 'react-icons/md'

const tempState = {
    post: { posts: [], selectedPost: null, selectedAnimal: '' },
    user: { users: [], currentUser: null, logged_in: true },
    review: { reviews: [], selectedReview: null, selectedAnimal: '' },
    application: { applications: [], selectedApplication: null },
    qna: { qnas: [], selectedQna: null }
}

const tempLoggedOutState = {
    post: { posts: [], selectedPost: null, selectedAnimal: '' },
    user: { users: [], currentUser: null, logged_in: false },
    review: { reviews: [], selectedReview: null, selectedAnimal: '' },
    application: { applications: [], selectedApplication: null },
    qna: { qnas: [], selectedQna: null }
}

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const testQnaFormat = {
    id: 1,
    title: 'QNA_TEST_TITLE',
    content: 'QNA_TEST_CONTENT',
}

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')
jest.mock('../../Header/Header', () => () => 'Header')
jest.mock('../../Footer/Footer', () => () => 'Footer')
jest.mock('../../Layout/ScrollToTop', () => () => '')

describe('<QnaCreate />', () => {
    let qnaCreate: JSX.Element
    let qnaCreateLoggedOut: JSX.Element
    beforeEach(() => {
        jest.clearAllMocks()
        qnaCreate = (
            <Provider store={getMockStore(tempState)}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path='/qna/create'
                            element={<QnaCreate />}
                        />
                        <Route
                            path='/'
                            element={<Navigate to={'/qna/create'} />}
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        )
        qnaCreateLoggedOut = (
            <Provider store={getMockStore(tempLoggedOutState)}>
                <MemoryRouter>
                    <Routes>
                        <Route path='/qna/create' element={<QnaCreate />} />
                        <Route
                            path='/'
                            element={<Navigate to={'/qna/create'} />}
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        )
    })
    it('should render without errors', async () => {
        render(qnaCreate)
        await screen.findByText('Qna 올리기')
    })
    it('should render button and inputs', async () => {
        render(qnaCreate)
        const titleInput = await screen.findByLabelText('제목:')
        fireEvent.change(titleInput, {
            target: { value: 'QNA_TEST_TITLE' }
        })
        const contentInput = await screen.findByLabelText(
            '질문 사항을 작성해주세요 :'
        )
        fireEvent.change(contentInput, {
            target: { value: 'QNA_TEST_CONTENT' }
        })
        await screen.findByText('게시하기')
        await waitFor(() =>
            expect(titleInput).toHaveValue('QNA_TEST_TITLE')
        )
        await waitFor(() =>
            expect(contentInput).toHaveValue('QNA_TEST_CONTENT')
        )
    })
    it('should render navigate to /qna when submitted', async () => {
        jest.spyOn(axios, 'post').mockResolvedValueOnce({
            data: testQnaFormat
        })
        const { container } = render(qnaCreate)
        const titleInput = await screen.findByLabelText('제목:')
        const contentInput = await screen.findByLabelText(
            '질문 사항을 작성해주세요 :'
        )
        const qnaButton = screen.getByText('게시하기')
        fireEvent.change(titleInput, { target: { value: 'QNA_TEST_TITLE' } })
        fireEvent.change(contentInput, { target: { value: 'QNA_TEST_CONTENT' } })

        await screen.findByDisplayValue('QNA_TEST_TITLE')
        await screen.findByDisplayValue('QNA_TEST_CONTENT')
        fireEvent.click(qnaButton)
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith('/qna')
        )
    })
    it('should render navigate to / when back Button clicked', async () => {
        render(qnaCreate)
        const backButton = await screen.findByRole('button', {
            name: /back-button/i
        })

        fireEvent.click(backButton)
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith('/qna')
        )
    })

    // it('should alert error when failed', async () => {
    //     jest.spyOn(axios, 'post').mockRejectedValueOnce({})
    //     window.alert = jest.fn()

    //     const { container } = render(qnaCreate)
    //     const titleInput = await screen.findByLabelText('제목:')
    //     fireEvent.change(titleInput, { target: { value: 'QNA_TEST_TITLE' } })

    //     const contentInput = await screen.findByLabelText(
    //         '질문 사항을 작성해주세요 :'
    //     )
    //     fireEvent.change(contentInput, {
    //         target: { value: 'QNA_TEST_CONTENT' }
    //     })
    //     const qnaButton = await screen.findByText('게시하기')
    //     fireEvent.click(qnaButton)
    //     await waitFor(() => expect(window.alert).toHaveBeenCalledWith('ERROR'))
    // })
})
