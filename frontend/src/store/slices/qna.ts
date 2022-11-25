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
}

export interface qnaState {
    qnas: QnaType[]
    selectedQna: QnaType | null
}

const initialState: qnaState = {
    // qnas: [],
    // selectedQna: null
    qnas: [
        { id: 1, author_id: 1, author_name: "paw", title: "Be-a-family", content: "개가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-20", hits: 1 },
        { id: 2, author_id: 1, author_name: "paw", title: "Be-a-family", content: "고양이가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-20", hits: 1 },
        { id: 3, author_id: 1, author_name: "paw", title: "Be-a-family", content: "앵무새가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-20", hits: 1 },
        { id: 4, author_id: 1, author_name: "paw", title: "working", content: "햄스터가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-11", hits: 3 },
        { id: 5, author_id: 1, author_name: "paw", title: "eslint sucks", content: "친칠라가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-11", hits: 3 },
        { id: 6, author_id: 1, author_name: "paw", title: "6th", content: "고슴도치가 말을 듣지 않아요. 어떻게 하죠?", created_at: "2022-11-11", hits: 4 },
    ],
    selectedQna: null
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
})

export const qnaActions = qnaSlice.actions
export const selectQna = (state: RootState) => state.qna

export default qnaSlice.reducer
