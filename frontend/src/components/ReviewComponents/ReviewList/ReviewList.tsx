import Layout from "../../Layout/Layout";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Review from "../Review/Review";
import {
	getReviews,
	reviewType,
	selectReview,
} from "../../../store/slices/review";
import { AppDispatch } from "../../../store";
import { MdFilterList, MdOutlineAddBox } from "react-icons/md";
import "./ReviewList.scss";

export default function ReviewList() {
	const navigate = useNavigate();

	const reviewState = useSelector(selectReview);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(getReviews());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout>
			<div className="ListContainer">
				<div className="ReviewList">
					<div id="list-filter-button">
						<MdFilterList size="25" />
					</div>
					<div className="reviews">
						{reviewState.reviews.map((review: reviewType) => {
							return (
								<Review
									key={`${review.id}_review`}
									title={review.title}
									photo_path={review.photo_path}
									author={review.author_name}
									clickDetail={() =>
										navigate("/review/" + review.id)
									}
								/>
							);
						})}
					</div>
					<div className="create-review">
						<button
							id="create-review-button"
							onClick={() => navigate("/reviews/create")}
						>
							<MdOutlineAddBox size="50" />
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
