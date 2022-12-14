/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '..'

export interface commentType {
	id: number
	author_id: number
	author_name: string
	content: string
	created_at: string
	editable: boolean
}

export interface QnaType {
	id: number
	author_id: number
	author_name: string
	title: string
	content: string
	created_at: string
	hits: number
	comments: commentType[]
	editable: boolean
}

export interface QnaFilterType {
	page: number
}

export interface commentState {
	comments: commentType[]
	selectedComment: commentType | null
}

export interface qnaState {
	qnas: QnaType[]
	selectedQna: QnaType | null
}

const initialState: qnaState = {
	qnas: [],
	selectedQna: null
}

export const getQnas = createAsyncThunk(
	'qna/getQnas',
	async (data: QnaFilterType, { dispatch }) => {
		const response = await axios.get('/api/questions/', { params: data })
		return response.data
	}
)

export const getQna = createAsyncThunk(
	'qna/getQna',
	async (id: QnaType['id'], { dispatch }) => {
		const response = await axios.get(`/api/questions/${id}/`)
		return response.data ?? null
	}
)

export const createQna = createAsyncThunk(
	'qna/createQna',
	async (qna: FormData, { dispatch }) => {
		const response = await axios.post('/api/questions/', qna)
		dispatch(qnaActions.addQna(response.data))
		return response.data
	}
)

export const editQna = createAsyncThunk(
	'post/editPost',
	async (qna: QnaType, { dispatch }) => {
		const response = await axios.put(`/api/questions/${qna.id}/`, qna)
		dispatch(
			qnaActions.editQna({
				id: response.data.id,
				title: response.data.title,
				content: response.data.content,
				created_at: response.data.created_at
			})
		)
		return response.data
	}
)

export const deleteQna = createAsyncThunk(
	'qna/deleteQna',
	async (id: QnaType['id'], { dispatch }) => {
		await axios.delete(`/api/questions/${id}/`)
		dispatch(qnaActions.deleteQna({ targetId: id }))
	}
)

export const createComment = createAsyncThunk(
	'qna/createComment',
	async (arg: { comment: { content: string }; id: number }, { dispatch }) => {
		const response = await axios.post(
			`/api/questions/${arg.id}/comments/`,
			arg.comment
		)
		dispatch(qnaActions.addComment(response.data))
		return response.data
	}
)

export const qnaSlice = createSlice({
	name: 'qna',
	initialState,
	reducers: {
		deleteQna: (state, action: PayloadAction<{ targetId: number }>) => {
			const deleted = state.qnas.filter((qna: QnaType) => {
				return qna.id !== action.payload.targetId
			})
			state.qnas = deleted
		},
		editQna: (
			state,
			action: PayloadAction<{
				id: number
				title: string
				content: string
				created_at: string
			}>
		) => {
			const qna = state.qnas.find(
				(value: QnaType) => value.id === action.payload.id
			)
			if (qna != null) {
				qna.title = action.payload.title
				qna.content = action.payload.content
				qna.created_at = action.payload.created_at
			}
		},
		addQna: (
			state,
			action: PayloadAction<{
				id: number
				author_id: number
				author_name: string
				title: string
				content: string
			}>
		) => {
			const newQna = {
				id: action.payload.id,
				author_id: action.payload.author_id,
				author_name: action.payload.author_name,
				title: action.payload.title,
				content: action.payload.content,
				created_at: '',
				hits: 0,
				comments: [],
				editable: false
			}
			state.qnas.push(newQna)
		},
		addComment: (
			state,
			action: PayloadAction<{
				id: number
				author_id: number
				author_name: string
				content: string
				created_at: string
				editable: boolean
			}>
		) => {
			const newComment = {
				id: action.payload.id,
				author_id: action.payload.author_id,
				author_name: action.payload.author_name,
				content: action.payload.content,
				created_at: action.payload.created_at,
				editable: action.payload.editable
			}
			state.selectedQna?.comments.push(newComment)
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getQnas.fulfilled, (state, action) => {
			state.qnas = action.payload.results
		})
		builder.addCase(getQna.fulfilled, (state, action) => {
			state.selectedQna = action.payload
		})
		builder.addCase(createQna.rejected, (_state, action) => {
			console.error(action.error)
		})
	}
})

export const qnaActions = qnaSlice.actions
export const selectQna = (state: RootState) => state.qna

export default qnaSlice.reducer
