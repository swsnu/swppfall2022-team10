/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { checkLogin } from '../../../store/slices/user'
import { FiSend } from 'react-icons/fi'
import './ChattingInput.scss'


export default function ChattingInput() {
	const [loading, setLoading] = useState<boolean>(true)
	const [content, setContent] = useState<string>('')

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(checkLogin()).then((result) => {
			const loggedIn: boolean = (result.payload as { logged_in: boolean })
				.logged_in
			setLoading(!loggedIn)
			if (!loggedIn) {
				alert('You should log in')
				navigate('/login')
			}
		})
	}, [])


	const sendMessageHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const data = {
			content: content
		}
		const formData = new FormData()
		formData.append('content', JSON.stringify(data))


		// dispatch(createPost(formData))
		// 	.then((result) => {
		// 		const id: number = result.payload.id
		// 		navigate(`/post/${id}`)
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 		alert('ERROR')
		// 	})
	}

	return (
		<div className='Message'>
			{!loading ? (
				<div className='MessageContainer'>
                    <form
                        className='send-message-container'
                        onSubmit={sendMessageHandler}
                    >
						<div className='message-container'>
							<input
								className='message-input'
								id='message-input'
								name='content'
								placeholder='메세지를 입력해 주세요.'
								onChange={(event) =>
									setContent(event.target.value)
								}
								value={content}
							/>
						</div>
                        <button
                            id='send-button'
                            type='submit'
							disabled={content === ''}
                        >
                            <FiSend />
                        </button>
                    </form>

				</div>
			) : (
				<div>Loading...</div>
			)}
		</div>
	)
}