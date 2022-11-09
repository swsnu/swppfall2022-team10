import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import PostCreate from "./PostCreate";
import { getMockStore } from "../../../test-utils/mock";
import { Provider } from "react-redux";
import * as postSlice from "../../../store/slices/post";
import { MdArrowBack } from 'react-icons/md'

const tempState = {
	post: {
		posts: [
			{
				id: 1,
				title: "POST_TEST_TITLE",
				author_id: 1,
			},
		],
		selectedPost: null,
	},
	user: { users: [], currentUser: null },
	review: { reviews: [], selectedReview: null },
};
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
	...jest.requireActual("react-router"),
	useNavigate: () => mockNavigate,
}));

describe("<PostCreate />", () => {
	// let postCreate: JSX.Element;
	// beforeEach(() => {
	// 	jest.clearAllMocks();
	// 	postCreate = (
	// 		<Provider store={getMockStore(tempState)}>
	// 			<MemoryRouter>
	// 				<Routes>
	// 					<Route
	// 						path="/post/create"
	// 						element={<PostCreate />}
	// 					/>
	// 					<Route
	// 						path="/"
	// 						element={<Navigate to={"/post/create"} />}
	// 					/>
	// 				</Routes>
	// 			</MemoryRouter>
	// 		</Provider>
	// 	);
	// });
	// it("should render without errors", async () => {
	// 	render(postCreate);
	// 	await screen.findByText("Edit Article");
	// });
	// it("should render button and inputs with original values", async () => {
	// 	render(postCreate);
	// 	const titleInput = await screen.findByLabelText("Title:");
	// 	const contentInput = await screen.findByLabelText("Content:");
	// 	await screen.findByText("Post");

	// 	await waitFor(() =>
	// 		expect(titleInput).toHaveValue("ARTICLE_TEST_TITLE")
	// 	);
	// 	await waitFor(() =>
	// 		expect(contentInput).toHaveValue("ARTICLE_TEST_CONTENT")
	// 	);
	// });
	// it("should render navigate to /post/:id when submitted", async () => {
	// 	jest.spyOn(axios, "put").mockResolvedValueOnce({
	// 		data: {
	// 			id: 1,
	// 			author_id: 1,
	// 			title: "NEW_TITLE",
	// 			content: "NEW_CONTENT",
	// 		},
	// 	});
	// 	render(postCreate);
	// 	const titleInput = screen.getByLabelText("Title:");
	// 	const contentInput = screen.getByLabelText("Content:");
	// 	const postButton = screen.getByText("Post");
	// 	fireEvent.change(titleInput, { target: { value: "NEW_TITLE" } });
	// 	fireEvent.change(contentInput, { target: { value: "NEW_CONTENT" } });
	// 	await screen.findByDisplayValue("NEW_TITLE");
	// 	await screen.findByDisplayValue("NEW_CONTENT");
	// 	fireEvent.click(postButton);
	// 	await waitFor(() =>
	// 		expect(mockNavigate).toHaveBeenCalledWith("/articles/1")
	// 	);
	// });
	// it("should render navigate to / when back Button clicked", async () => {
	// 	render(postCreate);
	// 	const backButton = screen.getByText(<MdArrowBack />);
	// 	fireEvent.click(backButton);
	// 	await waitFor(() =>
	// 		expect(mockNavigate).toHaveBeenCalledWith("/")
	// 	);
	// });
});