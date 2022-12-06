/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Comment from "../Comment/Comment"
import { selectComment, getComment } from '../../../store/slices/comment'
import { useSelector, useDispatch } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppDispatch } from '../../../store'

export default function CommentList() {
    const commentState = useSelector(selectComment)
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()

    useEffect(() => {
        dispatch(getComment(Number(id)))
    }, [dispatch, id]
    )
    console.log(id)

    return (
        <div className='CommentList'>
            <div>Comment List</div>
            <div>
                {commentState.comments.map((comment) => {
                    return (
                        <Comment
                            key={`${comment.id}_comment`}
                            author={comment.author_name}
                            content={comment.content}
                            created_at={comment.created_at}
                        />
                    )
                })}
            </div>
        </div>
    )
}
