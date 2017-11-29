import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import App from './App'
import './index.css'
import {LocaleProvider} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Router history={browserHistory}>
            <Route path="/(:page)" component={App}/>
        </Router>
    </LocaleProvider>,
document.getElementById('root'))
