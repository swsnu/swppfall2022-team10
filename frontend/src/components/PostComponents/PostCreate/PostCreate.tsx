import Layout from "../../Layout/Layout";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { createPost } from "../../../store/slices/post";
import { selectUser } from "../../../store/slices/user";
import { MdArrowBack } from "react-icons/md";

import "./PostCreate.scss";

export default function PostCreate() {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");

	const dispatch = useDispatch<AppDispatch>();
	const userState = useSelector(selectUser);
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!userState.currentUser) navigate("/login");
	// }, [userState.currentUser, navigate]);

	const createPostHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		console.log(event.target);
		// const data = {
		// 	title: event.target.form.title.value,
		// 	name: event.target.name.value,
		// 	animal_type: event.target.animal_type.value,
		// 	species: event.target.species.value,
		// 	age: event.target.age.value,
		// 	gender: event.target.gender.value,
		// 	neutering: event.target.neutering.value,
		// 	vaccination: event.target.vaccination.value,
		// 	character: event.target.content.value,
		// 	photo_path: [],
		// 	author_id: userState.currentUser ? userState.currentUser.id : 0,
		// };
		// const result = await dispatch(createPost(data));
		// if (result.type === `${createPost.typePrefix}/fulfilled`) {
		// 	navigate(`/posts/${result.payload.id}`);
		// } else {
		// 	alert("Error on create Post");
		// }
	};

	// if (!userState.currentUser) {
	// 	return <Navigate to="/login" />;
	// } else {
	return (
		<Layout>
			<div className="CreateContainer">
				<div className="PostCreate">
					<button
						id="back-create-post-button"
						onClick={(event) => {
							event.preventDefault();
							navigate("/");
						}}
					>
						<MdArrowBack />
					</button>
					<div>
						<div className="create-header">
							<h1>입양게시글 올리기</h1>
						</div>
						<form
							className="create-post-container"
							onSubmit={createPostHandler}
						>
							<div className="input-container">
								<label htmlFor="post-title-input">제목:</label>
								<input
									id="post-title-input"
									type="text"
									name="title"
								/>
							</div>
							<div className="input-container">
								<label htmlFor="post-name-input">이름:</label>
								<input
									id="post-name-input"
									type="text"
									name="name"
								/>
							</div>
							<div className="input-container">
								<label htmlFor="post-species-input">종:</label>
								<input
									id="post-species-input"
									type="text"
									name="species"
								/>
							</div>
							<div className="input-container">
								<label htmlFor="post-age-input">나이:</label>
								<input
									id="post-age-input"
									type="text"
									name="age"
								/>
							</div>
							<div className="input-container">
								<label htmlFor="post-gender-input">성별:</label>
								<div id="post-gender-input">
									<div className="radio-input">
										<input
											type="radio"
											id="gender-female"
											name="gender"
											value="female"
											checked
										/>
										<label htmlFor="female">암컷</label>
									</div>
									<div className="radio-input">
										<input
											type="radio"
											id="gender-male"
											name="gender"
											value="male"
										/>
										<label htmlFor="male">수컷</label>
									</div>
								</div>
							</div>
							<div className="input-container">
								<label htmlFor="post-neutering-input">
									중성화 여부:
								</label>
								<div id="post-neutering-input">
									<div className="radio-input">
										<input
											type="radio"
											id="neutering-done"
											name="neutering"
											value="done"
											checked
										/>
										<label htmlFor="done">O</label>
									</div>
									<div className="radio-input">
										<input
											type="radio"
											id="neutering-undone"
											name="neutering"
											value="undone"
										/>
										<label htmlFor="undone">X</label>
									</div>
								</div>
							</div>
							<div className="content-container">
								<label htmlFor="post-content-input">
									동물에 대해 추가로 알려주세요! 자세한 설명은
									입양에 도움이 됩니다:&#41;
								</label>
								<textarea
									id="post-content-input"
									name="content"
								/>
							</div>
							<button
								id="confirm-create-post-button"
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
