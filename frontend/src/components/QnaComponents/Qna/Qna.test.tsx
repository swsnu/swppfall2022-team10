import { render, screen } from '@testing-library/react'
import Qna from './Qna'
describe('<Qna />', () => {
    it('should render without errors', () => {
        render(
            <Qna
                id={1}
                title={'QNA_TITLE'}
                created_at={'0000-00-00'}
                hits={3}
                clickDetail={undefined}
            />
        )
        screen.getByText('QNA_TITLE')
        screen.getByText(/1/)
        screen.getByText(/0000-00-00/)
        screen.getByText(/3/)
    })
})
