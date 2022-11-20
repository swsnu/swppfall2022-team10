/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { createReview } from '../../../store/slices/review'
import { selectUser } from '../../../store/slices/user'
import { MdArrowBack } from 'react-icons/md'

import './QnaCreate.scss'

export default function QnaCreate() {
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userState = useSelector(selectUser)

    const createQnaHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!userState.logged_in) {
            alert('You should login')
            return
        }

        if (title.length === 0) return

        const data = { title: title, content: content }
        const formData = new FormData()

        formData.append('content', JSON.stringify(data))

        /* dispatch(createReview(formData))
            .then((result) => {
                navigate(`/review`)
            })
            .catch((err) => {
                console.log(err)
                alert('ERROR')
            }) */
    }

    return (
        <Layout>
            <div className='CreateContainer'>
                <div className='QnaCreate'>
                    <button
                        id='back-create-qna-button'
                        aria-label='back-button'
                        onClick={(event) => {
                            event.preventDefault()
                            navigate('/qna')
                        }}
                    >
                        <MdArrowBack />
                    </button>
                    <div>
                        <div className='create-header'>
                            <h1>Qna 올리기</h1>
                        </div>
                        <form
                            className='create-qna-container'
                            onSubmit={createQnaHandler}
                        >
                            <div className='input-container'>
                                <label htmlFor='qna-title-input'>
                                    제목:
                                </label>
                                <input
                                    id='qna-title-input'
                                    type='text'
                                    name='title'
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                />
                            </div>
                            <div className='content-container'>
                                <label htmlFor='qna-content-input'>
                                    질문 사항을 작성해주세요 :
                                </label>
                                <textarea
                                    id='qna-content-input'
                                    name='content'
                                    value={content}
                                    onChange={(event) =>
                                        setContent(event.target.value)
                                    }
                                />
                            </div>

                            <button
                                id='confirm-create-qna-button'
                                type='submit'
                                disabled={!(title && content)}
                            // onClick={createReviewHandler}
                            >
                                게시하기
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
    // }
}
