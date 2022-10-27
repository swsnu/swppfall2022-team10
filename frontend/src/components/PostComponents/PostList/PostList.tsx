import Layout from "../../Layout/Layout";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Post from "../Post/Post";
import { getPosts, postType, selectPost } from "../../../store/slices/post";
import { AppDispatch } from "../../../store";
import { MdFilterList, MdOutlineAddBox } from "react-icons/md";
import "./PostList.scss";

export default function PostList() {
	const navigate = useNavigate();

	const postState = useSelector(selectPost);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(getPosts());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout>
			<div className="ListContainer">
				<div className="PostList">
					<div id="list-filter-button">
						<MdFilterList size="25" />
					</div>
					<div className="posts">
						{postState.posts.map((post: postType) => {
							return (
								<Post
									key={`${post.id}_post`}
									title={post.title}
									animal_type={post.animal_type}
									photo_path={post.photo_path}
									species={post.species}
									age={post.age}
									gender={post.gender}
									author={post.author_name}
									clickDetail={() =>
										navigate("/post/" + post.id)
									}
								/>
							);
						})}
					</div>
					<div className="create-post">
						<button
							id="create-post-button"
							onClick={() => navigate("/posts/create")}
						>
							<MdOutlineAddBox size="50" />
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
