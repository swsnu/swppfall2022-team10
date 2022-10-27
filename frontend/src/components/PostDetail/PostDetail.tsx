import Layout from "../Layout/Layout";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Navigate, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store";
import { selectPost, getPost, deletePost } from "../../store/slices/post";
import { selectUser, getUser, UserType } from "../../store/slices/user";

import "./PostDetail.scss";

interface IProps {
	is_author: boolean;
}

const PostDetail = (props: IProps) => {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const userState = useSelector(selectUser);
	const postState = useSelector(selectPost);

	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getPost(Number(id)));
		if (postState.selectedPost)
			dispatch(getUser(postState.selectedPost.author_id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		<Layout>
			<div className="DetailContainer">
				<div className="PostDetail">
					<button
						id="back-detail-post-button"
						onClick={() => navigate("/")}
					>
						목록으로 돌아가기
					</button>
					<div className="post-images">
						{postState.selectedPost?.photo_path.map((img_path) => {
							return (
								<img
									className="post-image"
									src={img_path}
									alt={postState.selectedPost?.animal_type}
								/>
							);
						})}
					</div>
					<div className="post-header-container">
						<div className="post-title-container">
							<h2 id="post-title" className="left">
								{postState.selectedPost?.title}
							</h2>
							<p>
								{postState.selectedPost?.author_name},
								{postState.selectedPost?.created_at}
							</p>
						</div>
						{postState.selectedPost?.is_active ? (
							<div className="post-adoption-status" id="">
								입양상담 진행 중
							</div>
						) : (
							<div className="post-adoption-status" id="">
								입양상담 마감
							</div>
						)}
					</div>
					<hr />
					<div className="post-content-container">
						<p className="post-content">
							이름: {postState.selectedPost?.name}
						</p>
						<p className="post-content">
							나이: {postState.selectedPost?.age}세
						</p>
						<p className="post-content">
							성별:{" "}
							{postState.selectedPost?.gender ? "암컷" : "수컷"}
						</p>
						<p className="post-content">
							품종: {postState.selectedPost?.species}
						</p>
						<p className="post-content">
							백신접종여부:{" "}
							{postState.selectedPost?.vaccination ? "O" : "X"}
						</p>
						<p className="post-content">
							중성화여부:{" "}
							{postState.selectedPost?.neutering ? "O" : "X"}
						</p>
						<br />
						<p className="post-content">
							특징: <br />
							{postState.selectedPost?.character
								.split("\n")
								.map((line) => {
									return (
										<span>
											{line}
											<br />
										</span>
									);
								})}
						</p>
					</div>
					{postState.selectedPost?.author_id ===
						userState.currentUser?.id && (
						<div className="post-buttons">
							<button
								id="edit-post-button"
								onClick={() => {
									navigate(`/post/${id}/edit`);
								}}
							>
								수정
							</button>
							<button
								id="delete-post-button"
								onClick={() => {
									dispatch(deletePost(Number(id)));
									navigate("/");
								}}
							>
								삭제
							</button>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};
export default PostDetail;
