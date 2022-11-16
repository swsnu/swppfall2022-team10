/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import Login from './components/Login/Login'
import PostList from './components/PostComponents/PostList/PostList'
import PostDetail from './components/PostComponents/PostDetail/PostDetail'
import PostCreate from './components/PostComponents/PostCreate/PostCreate'
import PostEdit from './components/PostComponents/PostEdit/PostEdit'
import ReviewList from './components/ReviewComponents/ReviewList/ReviewList'
import ReviewCreate from './components/ReviewComponents/ReviewCreate/ReviewCreate'
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
					<Route path='/post/create' element={<PostCreate />} />
					{/* <Route path="/post/:id/submit" element={<ApplyCreate />} /> */}
					<Route
						path='/mypost/:id'
						element={<PostDetail is_author={true} />}
					/>
					<Route path='/review' element={<ReviewList />} />
					{/* <Route
						path="/review/:id"
						element={<ReviewDetail is_author={false} />}
					/> */}
					<Route path='/reviews/create' element={<ReviewCreate />} />
					<Route path='*' element={<h1>Not Found</h1>} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
