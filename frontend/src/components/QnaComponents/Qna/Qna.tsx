export interface IProps {
	id: number
	title: string
	created_at: string
	hits: number
	clickDetail?: React.MouseEventHandler<HTMLButtonElement>
}

const Qna = (props: IProps) => {
	return (
		<div className='Qna' data-testid='spyQna'>
			<div className='qna-row'>
				<div>{props.id}</div>
				<div>{props.title}</div>
				<div>{props.created_at}</div>
				<div>{props.hits}</div>
			</div>
		</div>
	)
}
export default Qna
