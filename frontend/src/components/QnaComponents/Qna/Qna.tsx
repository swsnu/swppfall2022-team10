export interface IProps {
    id: number
    title: string
    created_at: string
    hits: number
    clickDetail?: React.MouseEventHandler<HTMLButtonElement>
}

const Qna = (props: IProps) => {
    return (
        <div className='Qna'>
            <tr className='qna-row'>
                <td>{props.id}</td>
                <td>{props.title}</td>
                <td>{props.created_at}</td>
                <td>{props.hits}</td>
            </tr>
        </div>
    )
}
export default Qna
