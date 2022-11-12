/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import PostCreate from './PostCreate'
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
	age: 0,
	content: "POST_TEST_CONTENT",
	gender: true,
	vaccination: true,
	neutering: true,
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

describe('<PostCreate />', () => {
    let postCreate: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        postCreate = (
            <Provider store={getMockStore(tempState)}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/post/create"
                            element={<PostCreate />}
                        />
                        <Route
                            path="/"
                            element={<Navigate to={"/post/create"} />}
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render without errors", async () => {
        render(postCreate);
        await screen.findByText("입양게시글 올리기");
    });
    it("should render button and inputs", async () => {
        render(postCreate);
        const titleInput = await screen.findByLabelText("제목:");
		fireEvent.change(titleInput, { target: { value: "POST_TEST_TITLE" } });

        const nameInput = await screen.findByLabelText("이름:");
		fireEvent.change(nameInput, { target: { value: "POST_TEST_NAME" } });

        const animalTypeInput = await screen.findByLabelText("동물:");
		fireEvent.change(animalTypeInput, { target: { value: "POST_TEST_ANIMAL_TYPE" } });

        const speciesInput = await screen.findByLabelText("종:");
		fireEvent.change(speciesInput, { target: { value: "POST_TEST_SPECIES" } });

        const ageInput = await screen.findByLabelText("나이:");
		fireEvent.change(ageInput, { target: { value: "5" } });

		await waitFor(() => {
			expect(titleInput).toHaveValue("POST_TEST_TITLE");
			expect(nameInput).toHaveValue("POST_TEST_NAME");

		});
    });
    // it("should render navigate to /post/:id when submitted", async () => {
    //     jest.spyOn(axios, "post").mockResolvedValueOnce({
    //         data: testPostFormat,
    //     });
    //     render(postCreate);
    //     const titleInput = await screen.findByLabelText("제목:");
	// 	fireEvent.change(titleInput, { target: { value: "POST_TEST_TITLE" } });

    //     const nameInput = await screen.findByLabelText("이름:");
	// 	fireEvent.change(nameInput, { target: { value: "POST_TEST_NAME" } });

    //     const animalTypeInput = await screen.findByLabelText("동물:");
	// 	fireEvent.change(animalTypeInput, { target: { value: "POST_TEST_ANIMAL_TYPE" } });

    //     const speciesInput = await screen.findByLabelText("종:");
	// 	fireEvent.change(speciesInput, { target: { value: "POST_TEST_SPECIES" } });

    //     const ageInput = await screen.findByLabelText("나이:");
	// 	fireEvent.change(ageInput, { target: { value: "5" } });

    //     const genderInput = await screen.findByRole("input", {name: /gender/});
	// 	fireEvent.change(genderInput, { target: { value: "암컷" } });

    //     // const vaccinationInput = await screen.findByLabelText("백신 접종 여부:");
	// 	// fireEvent.change(vaccinationInput, { target: { value: "O" } });

    //     // const neuteringInput = await screen.findByLabelText("중성화 여부:");
	// 	// fireEvent.change(neuteringInput, { target: { value: "O" } });

    //     const contentInput = await screen.findByLabelText("동물에 대해 추가로 알려주세요! 자세한 설명은 입양에 도움이 됩니다:&#41;");
	// 	fireEvent.change(contentInput, { target: { value: "POST_TEST_CONTENT" } });

    //     const fileContents = 'file contents';
    //     const file = new Blob([fileContents], {type : 'text/plain'});
    //     const fileInput = await screen.findByLabelText("사진:");
	// 	fireEvent.change(fileInput, { target: { value: file } });

    //     const postButton = await screen.findByText("게시하기");
    //     fireEvent.click(postButton);
    //     await waitFor(() =>
    //         expect(mockNavigate).toHaveBeenCalledWith("/post/1")
    //     );
    // });
    it("should render navigate to / when back Button clicked", async () => {
        render(postCreate);
        const backButton = await screen.findByRole('button', {name: /back-button/i});
        fireEvent.click(backButton);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/")
        );
    });
})