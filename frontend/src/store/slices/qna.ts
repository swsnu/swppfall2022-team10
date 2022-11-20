import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '..'

export interface QnaType {
    id: number
    title: string
    created_at: string
    hits: number
}

export interface qnaState {
    qnas: QnaType[]
    selectedQna: QnaType | null
}

const initialState: qnaState = {
    qnas: [
        { id: 1, title: "Be-a-family", created_at: "2022-11-20", hits: 1 },
        { id: 2, title: "Be-a-family", created_at: "2022-11-20", hits: 1 },
        { id: 3, title: "Be-a-family", created_at: "2022-11-20", hits: 1 },
        { id: 4, title: "working", created_at: "2022-11-11", hits: 3 },
        { id: 5, title: "eslint sucks", created_at: "2022-11-11", hits: 3 },
        { id: 6, title: "6th", created_at: "2022-11-11", hits: 4 },
    ],
    selectedQna: null
}


export const qnaSlice = createSlice({
    name: 'qna',
    initialState,
    reducers: {
        getAll: (state, action: PayloadAction<{ qnas: QnaType[] }>) => { },
        getQna: (state, action: PayloadAction<{ targetId: number }>) => { },
        deleteQna: (state, action: PayloadAction<{ targetId: number }>) => { },
        addQna: (
            state,
            action: PayloadAction<{ title: string }>
        ) => {
            const newQna = {
                id: state.qnas[state.qnas.length - 1].id + 1,
                title: action.payload.title,
                created_at: '2022-11-20',
                hits: 1,
            };
            state.qnas.push(newQna);
        }
    }
})

export const qnaActions = qnaSlice.actions
export const selectQna = (state: RootState) => state.qna

export default qnaSlice.reducer
