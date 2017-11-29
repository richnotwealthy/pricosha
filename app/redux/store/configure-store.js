import {
	createLogger
} from 'redux-logger'
import rootReducer from '../reducers'
import {
	createStore,
	applyMiddleware
} from 'redux'

const loggerMiddleware = createLogger()

export default (initialState) => {
	const store = createStore(
		rootReducer,
		applyMiddleware(
			loggerMiddleware,
		),
		initialState
	)

	return store
}