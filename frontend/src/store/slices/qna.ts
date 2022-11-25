import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

export interface QnaType {
	id: number
	title: string
	content: string
	created_at: string
	hits: number
}

export interface qnaState {
	qnas: QnaType[]
	selectedQna: QnaType | null
}

const initialState: qnaState = {
	qnas: [
		{
			id: 1,
			title: 'Be-a-family',
			content: '개가 말을 듣지 않아요. 어떻게 하죠?',
			created_at: '2022-11-20',
			hits: 1
		},
		{
			id: 2,
			title: 'Be-a-family',
			content: '고양이가 말을 듣지 않아요. 어떻게 하죠?',
			created_at: '2022-11-20',
			hits: 1
		},
		{
			id: 3,
			title: 'Be-a-family',
			content: '앵무새가 말을 듣지 않아요. 어떻게 하죠?',
			created_at: '2022-11-20',
			hits: 1
		},
		{
			id: 4,
			title: 'working',
			content: '햄스터가 말을 듣지 않아요. 어떻게 하죠?',
			created_at: '2022-11-11',
			hits: 3
		},
		{
			id: 5,
			title: 'eslint sucks',
			content: '친칠라가 말을 듣지 않아요. 어떻게 하죠?',
			created_at: '2022-11-11',
			hits: 3
		},
		{
			id: 6,
			title: '6th',
			content: '고슴도치가 말을 듣지 않아요. 어떻게 하죠?',
			created_at: '2022-11-11',
			hits: 4
		}
	],
	selectedQna: null
}

export const qnaSlice = createSlice({
	name: 'qna',
	initialState,
	reducers: {
		getAll: (state, action: PayloadAction<{ qnas: QnaType[] }>) => {},
		getQna: (state, action: PayloadAction<{ targetId: number }>) => {
			const target = state.qnas.find(
				(td) => td.id === action.payload.targetId
			)
			state.selectedQna = target ?? null
		},
		deleteQna: (state, action: PayloadAction<{ targetId: number }>) => {},
		addQna: (
			state,
			action: PayloadAction<{ title: string; content: string }>
		) => {
			const newQna = {
				id: state.qnas[state.qnas.length - 1].id + 1,
				title: action.payload.title,
				content: action.payload.content,
				created_at: '2022-11-20',
				hits: 1
			}
			state.qnas.push(newQna)
		}
	}
})

export const qnaActions = qnaSlice.actions
export const selectQna = (state: RootState) => state.qna

export default qnaSlice.reducer
