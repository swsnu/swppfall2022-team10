/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import Login from './components/Login/Login'
import PostList from './components/PostComponents/PostList/PostList'
import PostDetail from './components/PostComponents/PostDetail/PostDetail'
import PostCreate from './components/PostComponents/PostCreate/PostCreate'
import PostEdit from './components/PostComponents/PostEdit/PostEdit'
import PostApply from './components/PostComponents/PostApply/PostApply'
import MyPost from './components/PostComponents/MyPost/MyPost'
import MyApplyPost from './components/PostComponents/MyApplyPost/MyApplyPost'
import ReviewList from './components/ReviewComponents/ReviewList/ReviewList'
import ReviewCreate from './components/ReviewComponents/ReviewCreate/ReviewCreate'
import QnaList from './components/QnaComponents/QnaList/QnaList'
import QnaDetail from './components/QnaComponents/QnaDetail/QnaDetail'
import QnaCreate from './components/QnaComponents/QnaCreate/QnaCreate'
// import Chatting from './components/ChattingComponets/Chatting/Chatting'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<PostList />} />
					<Route path='/login' element={<Login />} />
					<Route
						path='/post/:id'
						element={<PostDetail is_author={false} />}
					/>
					<Route path='/post/:id/edit' element={<PostEdit />} />
					<Route path='/post/:id/submit' element={<PostApply />} />
					<Route path='/post/create' element={<PostCreate />} />
					<Route path='/mypost' element={<MyPost />} />
					<Route
						path='/myapply/:id'
						element={<MyApplyPost />}
					/>
					<Route path='/review' element={<ReviewList />} />
					{/* <Route
						path="/review/:id"
						element={<ReviewDetail is_author={false} />}
					/> */}
					<Route path='/reviews/create' element={<ReviewCreate />} />
					<Route path='/qna' element={<QnaList />} />
					<Route path='/qna/create' element={<QnaCreate />} />
					<Route path='/qna/:id' element={<QnaDetail />} />
					{/* <Route path='/chat' element={<Chatting />} /> */}
					<Route path='*' element={<h1>Not Found</h1>} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
