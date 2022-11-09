/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from "../../Layout/Layout";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from "react-router-dom";
import { AppDispatch } from '../../../store'
import { createReview } from '../../../store/slices/review'
import { selectUser } from '../../../store/slices/user'
import { MdArrowBack } from "react-icons/md";

import "./ReviewCreate.scss";

export default function ReviewCreate() {
	const [title, setTitle] = useState<string>("")
	const [content] = useState<string>("")
	const [file, setFile] = useState<File[]>([])

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	// useEffect(() => {
	// 	if (!userState.currentUser) navigate("/login");
	// }, [userState.currentUser, navigate]);

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
		if (files !== null) setFile(file.concat(Array.from(files)))
    };

	const createReviewHandler = (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		if (title.length === 0) return
		if (file.length === 0) return

		const data = {title: title, content: content}
		const formData = new FormData()
		formData.append('content', JSON.stringify(data))
		file.forEach((f, i) => formData.append('photos', f))
		dispatch(createReview(formData))
		navigate("/review");
	};

	// if (!userState.currentUser) {
	// 	return <Navigate to="/login" />;
	// } else {
	return (
		<Layout>
			<div className="CreateContainer">
				<div className="ReviewCreate">
					<button
						id="back-create-review-button"
						onClick={(event) => {
							event.preventDefault();
							navigate("/review");
						}}
					>
						<MdArrowBack />
					</button>
					<div>
						<div className="create-header">
							<h1>입양후기 올리기</h1>
						</div>
						<form
							className="create-review-container"
							onSubmit={createReviewHandler}
						>
							<div className="input-container">
								<label htmlFor="review-title-input">제목:</label>
								<input
									id="review-title-input"
									type="text"
									name="title"
								/>
							</div>
							<div className="content-container">
								<label htmlFor="review-content-input">
									입양 후기를 알려주세요! 자세한 후기는
									입양에 도움이 됩니다:&#41;
								</label>
								<textarea
									id="review-content-input"
									name="content"
								/>
							</div>
							<div className="photo-container">
								<label htmlFor="review-photo-input" id="photoLabel">사진:</label>
								<div id = "filebox">
									<label htmlFor="review-photo-input" id = "photo">파일 찾기</label>
									<input
										id="review-photo-input"
										type="file" multiple
										name="photo"
										accept = 'image/*'
										onChange={fileChangedHandler}
									/>
								</div>
							</div>
							{file.map((singleFile: File)=> {
							    return(
							        <div id="filenameList" key = {singleFile.name}>{singleFile.name}</div>
							    )
							})}
							<button
								id="confirm-create-review-button"
								type="submit"
								disabled={!(title && content)}
							>
								게시하기
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
	// }
}