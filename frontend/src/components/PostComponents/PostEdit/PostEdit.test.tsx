/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import PostEdit from './PostEdit'
import { getMockStore } from '../../../test-utils/mock'
import { Provider } from 'react-redux'
import * as postSlice from '../../../store/slices/post'
import { MdArrowBack } from 'react-icons/md'

const tempState = {
    post: { 
		posts: [], selectedPost: null },
    user: { users: [], currentUser: null, logged_in: true },
    review: {reviews: [], selectedReview: null}
}

const testPostFormat = {
    id: 1,
	author_id: 1,
	name: "POST_TEST_NAME",
	title: "POST_TEST_TITLE",
	animal_type: "POST_TEST_ANIMAL_TYPE",
	species: "POST_TEST_SPECIES",
	age: 5,
	content: "POST_TEST_CONTENT",
	gender: true,
	vaccination: true,
	neutering: true,
    photo_path: []
}

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate
}))

jest.mock("../../Header/Dropdown/Dropdown", () => () => "Dropdown");
jest.mock("../../Header/Header", () => () => "Header");
jest.mock("../../Footer/Footer", () => () => "Footer");
jest.mock("../../Layout/ScrollToTop", () => () => "");

describe('<PostEdit />', () => {
    let postEdit: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(axios, "get").mockResolvedValueOnce({data: {logged_in: true}});
        jest.spyOn(axios, "get").mockResolvedValueOnce({data: testPostFormat});
        postEdit = (
            <Provider store={getMockStore(tempState)}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/post/1/edit"
                            element={<PostEdit />}
                        />
                        <Route
                            path="/"
                            element={<Navigate to={"/post/1/edit"} />}
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render without errors", async () => {
        render(postEdit);
        await screen.findByText("입양게시글 수정하기");
    });
    it("should render button and inputs", async () => {
        render(postEdit);
        const titleInput = await screen.findByLabelText("제목:");
        const nameInput = await screen.findByLabelText("이름:");

		await waitFor(() => {
			expect(titleInput).toHaveValue("POST_TEST_TITLE");
			expect(nameInput).toHaveValue("POST_TEST_NAME");

		});
    });
    it("should render navigate to / when back Button clicked", async () => {
        render(postEdit);
        const backButton = await screen.findByRole('button', {name: /back-button/i});
        fireEvent.click(backButton);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/")
        );
    });
})