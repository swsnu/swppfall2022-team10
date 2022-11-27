import './Comment.scss'

export interface IProps {
    // qna_id: number
    // id: number
    author: string
    content: string
    created_at: string
}

const Comment = (props: IProps) => {
    return (
        <div className='Comment'>
            <div className="author">{props.author}</div>
            <div>{props.content}</div>
            <div>{props.created_at}</div>
        </div>
    )
}
export default Comment
