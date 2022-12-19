/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { qnaState } from '../../../store/slices/qna'
import { getMockStore } from '../../../test-utils/mock'
import Introduction from './Introduction'
import axios from 'axios'
import { act } from 'react-dom/test-utils'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

const scrollToSpy = jest.fn()
global.scrollTo = scrollToSpy

jest.mock('../../Header/Dropdown/Dropdown', () => () => 'Dropdown')

describe('<Introduction />', () => {
    let introduction: JSX.Element
    beforeEach(() => {
        jest.clearAllMocks()
        introduction = (
            <MemoryRouter>
                <Routes>
                    <Route path='/introduction' element={<Introduction />} />
                </Routes>
            </MemoryRouter>
        )
    })

    it('should render ListContainer', async () => {
        await act(() => {
            const { container } = render(introduction)
            expect(container).toBeTruthy()
        })
        // await screen.findByText('About')
        // await screen.findByText('Who we are')
        // await screen.findByText('Be A Family 이용 약관')
    })

    it('should render User Guide', async () => {
        await act(() => {
            const { container } = render(introduction)
            expect(container).toBeTruthy()
        })
        // await screen.findByText('User Guide')
        // await screen.findByText('For Foster Carers')
        // await screen.findByText('For First-time Carers')
        // await screen.findByText('For First-time Users')
    })
})
