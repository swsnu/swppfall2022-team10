/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import ReviewCreate from './ReviewCreate'
import { getMockStore } from '../../../test-utils/mock'
import { Provider } from 'react-redux'
import * as reviewSlice from '../../../store/slices/review'
import { MdArrowBack } from 'react-icons/md'

// const tempState = {
//     post: { posts: [], selectedPost: null },
//     user: { users: [], currentUser: null },
//     review: {
//         reviews: [
//             {
//                 id: 1,
//                 title: 'REVIEW_TEST_TITLE',
//                 author_id: 1
//             }
//         ], selectedReview: null
//     }
// }
// const mockNavigate = jest.fn()
// jest.mock('react-router', () => ({
//     ...jest.requireActual('react-router'),
//     useNavigate: () => mockNavigate
// }))
//
// describe('<ReviewCreate />', () => {
//     let reviewCreate: JSX.Element;
//     beforeEach(() => {
//         jest.clearAllMocks();
//         reviewCreate = (
//             <Provider store={getMockStore(tempState)}>
//                 <MemoryRouter>
//                     <Routes>
//                         <Route
//                             path="/reviews/create"
//                             element={<ReviewCreate />}
//                         />
//                         <Route
//                             path="/"
//                             element={<Navigate to={"/reviews/create"} />}
//                         />
//                     </Routes>
//                 </MemoryRouter>
//             </Provider>
//         );
//     });
//     it("should render without errors", async () => {
//         render(reviewCreate);
//         await screen.findByText("Edit Article");
//     });
//     it("should render button and inputs with original values", async () => {
//         render(reviewCreate);
//         const titleInput = await screen.findByLabelText("Title:");
//         const contentInput = await screen.findByLabelText("Content:");
//         await screen.findByText("Review");
//         await waitFor(() =>
//             expect(titleInput).toHaveValue("ARTICLE_TEST_TITLE")
//         );
//         await waitFor(() =>
//             expect(contentInput).toHaveValue("ARTICLE_TEST_CONTENT")
//         );
//     });
//     it("should render navigate to /post/:id when submitted", async () => {
//         jest.spyOn(axios, "put").mockResolvedValueOnce({
//             data: {
//                 id: 1,
//                 author_id: 1,
//                 title: "NEW_TITLE",
//                 content: "NEW_CONTENT",
//             },
//         });
//         render(reviewCreate);
//         const titleInput = screen.getByLabelText("Title:");
//         const contentInput = screen.getByLabelText("Content:");
//         const reviewButton = screen.getByText("Review");
//         fireEvent.change(titleInput, { target: { value: "NEW_TITLE" } });
//         fireEvent.change(contentInput, { target: { value: "NEW_CONTENT" } });
//         await screen.findByDisplayValue("NEW_TITLE");
//         await screen.findByDisplayValue("NEW_CONTENT");
//         fireEvent.click(reviewButton);
//         await waitFor(() =>
//             expect(mockNavigate).toHaveBeenCalledWith("/articles/1")
//         );
//     });
//     it("should render navigate to / when back Button clicked", async () => {
//         render(reviewCreate);
//         const backButton = screen.getByText(<MdArrowBack />);
//         fireEvent.click(backButton);
//         await waitFor(() =>
//             expect(mockNavigate).toHaveBeenCalledWith("/")
//         );
//     });
// })
