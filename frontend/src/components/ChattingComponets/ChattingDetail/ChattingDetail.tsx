import './ChattingDetail.scss'
import ChattingInput from "../ChattingInput/ChattingInput";
export interface IProps {
	username: string
}

const ChattingDetail = (props: IProps) => {
	return (
		<div className='screen'>
			<div className='chat-content'>
				{props.username}
			</div>
			<div className='message-input'>
				<ChattingInput />
			</div>
		</div>
	)
}
export default ChattingDetail