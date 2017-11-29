import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import App from './App'
import './index.css'
import {Provider} from 'react-redux'
import configureStore from './redux/store/configure-store'
import {LocaleProvider} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const store = configureStore()

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/(:page)" component={App}/>
            </Router>
        </Provider>
    </LocaleProvider>,
document.getElementById('root'))
