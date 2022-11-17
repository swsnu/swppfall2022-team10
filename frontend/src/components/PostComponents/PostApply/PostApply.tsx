/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '../../Layout/Layout'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { AppDispatch } from '../../../store'
// import { createPost, postCreateType } from '../../../store/slices/post'
import { selectPost, getPost } from '../../../store/slices/post'
import { selectUser } from '../../../store/slices/user'
import './PostApply.scss'
import PostHeader from '../PostHeader/PostHeader'
import DropdownList from 'react-widgets/DropdownList'

export default function PostApply() {
    const { id } = useParams()
	const [name, setName] = useState<string>('')
	const [gender, setGender] = useState<string>('')
	const [age, setAge] = useState<string>('')
	const [phoneNumber, setPhoneNumber] = useState<string>('')
	const [availableTime, setAvailableTime] = useState<string>('')
	const [livingArea, setLivingArea] = useState<string>('')
	const [marriage, setMarriage] = useState<string>('')
	const [job, setJob] = useState<string>('')

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const userState = useSelector(selectUser)
	useEffect(() => {
		dispatch(getPost(Number(id))).then((result)=> {
			// setEditable(result.payload.editable)
			// setEditable(true)
		})
	}, [id])

	const fields = [
		name,
		gender,
		age,
		phoneNumber,
		availableTime,
		livingArea,
		marriage,
		job,
	]

	const ApplyHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!userState.logged_in) {
			alert('You should log in')
			navigate('/login')
			return
		}

		const emptyField = fields.filter((x) => x === '')
		if (emptyField.length !== 0) return

		const ageInt = parseInt(age)
		if (isNaN(ageInt) || ageInt <= 0 || ageInt > 200) return

		const data = {
			name: name,
			gender: gender === '남',
			age: ageInt,
			phoneNumber: phoneNumber,
			availableTime: availableTime,
			livingArea: livingArea,
			marriage: marriage === '결혼함',
			job: job,
		}
		const formData = new FormData()
		formData.append('content', JSON.stringify(data))

		// dispatch(createPost(formData))
		//	.then((result) => {
		//		const id: number = result.payload.id
		//		navigate(`/post/${id}`)
		//	})
		//	.catch((err) => {
		//		console.log(err)
		//		alert('ERROR')
		//	})
	}

	return (
		<Layout>
			<div className='apply'>
				<div className='application'>
					<PostHeader is_author={true} />
					<div>
						<form
							className='applyForm'
							onSubmit={ApplyHandler}
						>
						    <div className='apply-container'>
                                <div className='input-container'>
                                    <label htmlFor='apply-name-input'>이름:</label>
                                    <input
                                        className='apply-input'
                                        id='apply-name-input'
                                        type='text'
                                        name='name'
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        value={name}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-gender-input'>성별:</label>
                                    <DropdownList
                                        id='apply-gender-input'
                                        className='apply-dropbox'
                                        name='gender'
                                        data={['남', '여']}
                                        onChange={(event) => setGender(event)}
                                        value={gender}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-age-input'>나이:</label>
                                    <input
                                        className='apply-input'
                                        id='apply-age-input'
                                        type='text'
                                        name='age'
                                        onChange={(event) =>
                                            setAge(event.target.value)
                                        }
                                        value={age}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-phoneNumber-input'>전화번호:</label>
                                    <input
                                        className='apply-input'
                                        id='apply-phoneNumber-input'
                                        type='text'
                                        name='phoneNumber'
                                        onChange={(event) =>
                                            setPhoneNumber(event.target.value)
                                        }
                                        value={phoneNumber}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-availableTime-input'>통화하기 편한 시간:</label>
                                    <input
                                        className='apply-input'
                                        id='apply-availableTime-input'
                                        type='text'
                                        name='availableTime'
                                        onChange={(event) =>
                                            setAvailableTime(event.target.value)
                                        }
                                        value={availableTime}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-livingArea-input'>사는 지역:</label>
                                    <input
                                        className='apply-input'
                                        id='apply-livingArea-input'
                                        type='text'
                                        name='livingArea'
                                        onChange={(event) =>
                                            setLivingArea(event.target.value)
                                        }
                                        value={livingArea}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-marriage-input'>
                                        결혼 여부:
                                    </label>
                                    <DropdownList
                                        id='apply-marriage-input'
                                        className='apply-dropbox'
                                        name='marriage'
                                        data={['결혼함', '결혼하지 않음']}
                                        onChange={(event) => setMarriage(event)}
                                        value={marriage}
                                    />
                                </div>
                                <div className='input-container'>
                                    <label htmlFor='apply-job-input'>신청인 직업:</label>
                                    <input
                                        className='apply-input'
                                        id='apply-job-input'
                                        type='text'
                                        name='job'
                                        onChange={(event) =>
                                            setJob(event.target.value)
                                        }
                                        value={job}
                                    />
                                </div>
                            </div>
							<button
								id='apply-button'
								type='submit'
							>
								보내기
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}