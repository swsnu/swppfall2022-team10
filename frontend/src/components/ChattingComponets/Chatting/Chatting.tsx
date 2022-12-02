/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback } from 'react'
import { AppDispatch } from '../../../store'
import ChattingDetail from '../ChattingDetail/ChattingDetail'

import './Chatting.scss'
import { applicationType } from '../../../store/slices/application'

export interface chatType {
	username: string
}

const dummyList = [
	{
		username: 'jhpyun2'
	},
	{
		username: 'jhpyun3'
	}
]

export default function Chatting() {
	const dispatch = useDispatch<AppDispatch>()

	const [clickedChat, setClickedChat] = useState<chatType>({
		username: ''
	})

	const onClickChatting = useCallback(
		(chat: chatType) => {
			setClickedChat(chat)
		},
		[clickedChat]
	)

	return (
		<Layout>
			<div className='chatting'>
				<div className='chatting-list'>
					{dummyList.map((chat: chatType) => {
						return (
							<div
								className='chat-list'
								key={chat.username}
								onClick={() => onClickChatting(chat)}
							>
								{chat.username}
							</div>
						)
					})}
				</div>
				<div className='chatting-screen'>
					<ChattingDetail username={clickedChat.username} />
				</div>
			</div>
		</Layout>
	)
}
