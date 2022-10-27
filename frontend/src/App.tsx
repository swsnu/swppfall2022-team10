import "./App.css";
import Login from "./components/Login/Login";
import PostList from "./components/PostList/PostList";
import PostCreate from "./components/PostCreate/PostCreate";
import PostDetail from "./components/PostDetail/PostDetail";
import PostEdit from "./components/PostEdit/PostEdit";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<PostList />} />
					<Route
						path="/post/:id"
						element={<PostDetail is_author={false} />}
					/>
					{/* <Route path="/post/:id/submit" element={<ApplyCreate />} /> */}
					<Route path="/post/create" element={<PostCreate />} />
					<Route
						path="/mypost/:id"
						element={<PostDetail is_author={true} />}
					/>
					<Route path="/mypost/:id/edit" element={<PostEdit />} />
					<Route path="*" element={<h1>Not Found</h1>} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
