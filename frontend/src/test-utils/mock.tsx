import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import { render, RenderOptions } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { AppStore, RootState } from '../store'
import postReducer from '../store/slices/post'
import reviewReducer from '../store/slices/review'
// import userReducer from '../store/slices/user'
import applicationReducer from '../store/slices/application'
import mypostReducer from '../store/slices/mypost'
import qnaReducer from '../store/slices/qna'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	preloadedState?: PreloadedState<RootState>
	store?: AppStore
}

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
	return configureStore({
		reducer: {
			post: postReducer,
			review: reviewReducer,
			// user: userReducer,
			application: applicationReducer,
			qna: qnaReducer,
			mypost: mypostReducer
		},
		preloadedState
	})
}

export function renderWithProviders(
	ui: React.ReactElement,
	{
		preloadedState,
		store = getMockStore(preloadedState),
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	function Wrapper({ children }: PropsWithChildren): JSX.Element {
		return <Provider store={store}>{children}</Provider>
	}

	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
