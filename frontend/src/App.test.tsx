import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'

const scrollToSpy = jest.fn();
global.scrollTo = scrollToSpy;

test('renders App.tsx', () => {
	render(
		<Provider store={store}>
			<App />
		</Provider>
	)
})
