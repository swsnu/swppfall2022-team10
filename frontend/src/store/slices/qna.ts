<<<<<<< HEAD
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from 'axios'
import { RootState } from '..'

export interface QnaType {
    id: number
    author_id: number
    author_name: string
    title: string
    content: string
    created_at: string
    hits: number
=======
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

export interface QnaType {
	id: number
	title: string
	content: string
	created_at: string
	hits: number
>>>>>>> e7a8dfbbe7f7e102ea0c9e3f364f6c98ceeec18b
}

export interface qnaState {
	qnas: QnaType[]
	selectedQna: QnaType | null
}

const initialState: qnaState = {
<<<<<<< HEAD
    qnas: [],
    selectedQna: null
    // qnas: [
    //     { id: 1, title: "Be-a-family", content: "개가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-20", hits: 1 },
    //     { id: 2, title: "Be-a-family", content: "고양이가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-20", hits: 1 },
    //     { id: 3, title: "Be-a-family", content: "앵무새가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-20", hits: 1 },
    //     { id: 4, title: "working", content: "햄스터가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-11", hits: 3 },
    //     { id: 5, title: "eslint sucks", content: "친칠라가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-11", hits: 3 },
    //     { id: 6, title: "6th", content: "고슴도치가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-11", hits: 4 },
    // ],
    // selectedQna: null
}

export const getQnas = createAsyncThunk('qna/getQnas', async () => {
    const response = await axios.get<QnaType[]>('/api/qnas/')
    return response.data
})

export const getQna = createAsyncThunk(
    'qna/getQna',
    async (id: QnaType['id'], { dispatch }) => {
        const response = await axios.get(`/api/qnas/${id}/`)
        return response.data ?? null
    }
)

export const createQna = createAsyncThunk(
    'review/createQna',
    async (qna: FormData, { dispatch }) => {
        const response = await axios.post('/api/qnas/', qna)
        dispatch(qnaActions.addQna(response.data))
        return response.data
    }
)

export const deleteQna = createAsyncThunk(
    'qna/deleteQna',
    async (id: QnaType['id'], { dispatch }) => {
        await axios.delete(`/api/qnas/${id}/`)
        dispatch(qnaActions.deleteQna({ targetId: id }))
    }
)

export const qnaSlice = createSlice({
    name: 'qna',
    initialState,
    reducers: {
        getAll: (state, action: PayloadAction<{ qnas: QnaType[] }>) => { },
        getQna: (state, action: PayloadAction<{ targetId: number }>) => {
            const target = state.qnas.find((td) => td.id === action.payload.targetId)
            state.selectedQna = target ?? null
        },
        deleteQna: (state, action: PayloadAction<{ targetId: number }>) => {
            const deleted = state.qnas.filter((qna: QnaType) => {
                return qna.id !== action.payload.targetId
            })
            state.qnas = deleted
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
            };
            state.qnas.push(newQna);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getQnas.fulfilled, (state, action) => {
            state.qnas = action.payload
        })
        builder.addCase(getQna.fulfilled, (state, action) => {
            state.selectedQna = action.payload
        })
        builder.addCase(createQna.rejected, (_state, action) => {
            console.error(action.error)
        })
    }
=======
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
>>>>>>> e7a8dfbbe7f7e102ea0c9e3f364f6c98ceeec18b
})

export const qnaActions = qnaSlice.actions
export const selectQna = (state: RootState) => state.qna

export default qnaSlice.reducer
