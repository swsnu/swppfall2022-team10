import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

export interface postType {
	id: number;
	author_id: number;
	author_name: string;
	name: string;
	vaccination: boolean;
	neutering: boolean;
	title: string;
	animal_type: string;
	photo_path: string[];
	species: string;
	age: number;
	gender: boolean;
	character: string;
	created_at: string;
	is_active: boolean;
}

export interface postState {
	posts: postType[];
	selectedPost: postType | null;
}

const initialState: postState = {
	posts: [],
	selectedPost: null,
};

export const getPosts = createAsyncThunk("post/getPosts", async () => {
	const response = await axios.get<postType[]>("/api/posts/");
	// console.log(typeof response.data);
	// console.log(response.data);
	return response.data;
});

export const getPost = createAsyncThunk(
	"post/getPost",
	async (id: postType["id"], { dispatch }) => {
		const response = await axios.get(`/api/posts/${id}/`);
		return response.data ?? null;
	}
);

export const createPost = createAsyncThunk(
	"post/createPost",
	async (post: postType, { dispatch }) => {
		const response = await axios.post("/api/posts/", post);
		dispatch(postActions.addPost(response.data));
		return response.data;
	}
);

export const deletePost = createAsyncThunk(
	"post/deletePost",
	async (id: postType["id"], { dispatch }) => {
		await axios.delete(`/api/posts/${id}/`);
		dispatch(postActions.deletePost({ targetId: id }));
	}
);

export const editPost = createAsyncThunk(
	"post/editPost",
	async (post: postType, { dispatch }) => {
		const response = await axios.put(`/api/posts/${post.id}/`, post);
		dispatch(
			postActions.editPost({
				targetId: post.id,
				title: post.title,
				name: post.name,
				vaccination: post.vaccination,
				neutering: post.neutering,
				animal_type: post.animal_type,
				species: post.species,
				photo_path: post.photo_path,
				age: post.age,
				gender: post.gender,
				character: post.character,
			})
		);
		return response.data;
	}
);

export const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		editPost: (
			state,
			action: PayloadAction<{
				targetId: number;
				name: string;
				vaccination: boolean;
				neutering: boolean;
				title: string;
				animal_type: string;
				species: string;
				photo_path: string[];
				age: number;
				gender: boolean;
				character: string;
			}>
		) => {
			const post = state.posts.find(
				(value: postType) => value.id === action.payload.targetId
			);
			if (post) {
				post.name = action.payload.name;
				post.vaccination = action.payload.vaccination;
				post.neutering = action.payload.neutering;
				post.title = action.payload.title;
				post.animal_type = action.payload.animal_type;
				post.species = action.payload.species;
				post.photo_path = action.payload.photo_path;
				post.age = action.payload.age;
				post.gender = action.payload.gender;
				post.character = action.payload.character;
			}
		},
		deletePost: (state, action: PayloadAction<{ targetId: number }>) => {
			const deleted = state.posts.filter((post: postType) => {
				return post.id !== action.payload.targetId;
			});
			state.posts = deleted;
		},
		addPost: (
			state,
			action: PayloadAction<{
				id: number;
				author_id: number;
				author_name: string;
				title: string;
				name: string;
				vaccination: boolean;
				neutering: boolean;
				animal_type: string;
				species: string;
				photo_path: string[];
				age: number;
				gender: boolean;
				character: string;
			}>
		) => {
			const newPost = {
				id: action.payload.id,
				author_id: action.payload.author_id,
				author_name: action.payload.author_name,
				name: action.payload.name,
				vaccination: action.payload.vaccination,
				neutering: action.payload.neutering,
				title: action.payload.title,
				animal_type: action.payload.animal_type,
				species: action.payload.species,
				photo_path: action.payload.photo_path,
				age: action.payload.age,
				gender: action.payload.gender,
				character: action.payload.character,
				created_at: "",
				is_active: true,
			};
			state.posts.push(newPost);
		},
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(getPosts.fulfilled, (state, action) => {
			// Add post to the state array
			state.posts = action.payload;
		});
		builder.addCase(getPost.fulfilled, (state, action) => {
			state.selectedPost = action.payload;
		});
		builder.addCase(createPost.rejected, (_state, action) => {
			console.error(action.error);
		});
	},
});

export const postActions = postSlice.actions;
export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
