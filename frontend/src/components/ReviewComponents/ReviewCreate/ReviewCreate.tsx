/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from "../../Layout/Layout";

import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

import "./ReviewCreate.scss";

export default function ReviewCreate() {
	const [title] = useState<string>("");
	const [content] = useState<string>("");
	const [file, setFile] = useState<{}>({ selectedFiles: null })

	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!userState.currentUser) navigate("/login");
	// }, [userState.currentUser, navigate]);

	const fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files);
        setFile({
            selectedFiles: files
        });
    };

	const createReviewHandler = async (
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
				<div className="ReviewCreate">
					<button
						id="back-create-post-button"
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
							className="create-post-container"
							onSubmit={createReviewHandler}
						>
							<div className="input-container">
								<label htmlFor="post-title-input">제목:</label>
								<input
									id="post-title-input"
									type="text"
									name="title"
								/>
							</div>
							<div className="content-container">
								<label htmlFor="post-content-input">
									입양 후기를 알려주세요! 자세한 후기는
									입양에 도움이 됩니다:&#41;
								</label>
								<textarea
									id="post-content-input"
									name="content"
								/>
							</div>
							<div className="photo-container">
								<label htmlFor="post-age-input">사진:</label>
								<input
									id="review-photo-input"
									type="file" multiple
									name="photo"
									accept = 'image/*'
									onChange={fileChangedHandler}
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
