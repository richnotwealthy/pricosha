import './App.css'
import React, {Component} from 'react'
import axios from 'axios'
import ContentViewer from './components/ContentViewer'
import LoginPage from './components/LoginPage'
import {Layout, Menu, Icon, message} from 'antd'
const {Content, Sider} = Layout
const {Item} = Menu

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collapsed: false,
			loggedIn: false,
			user: ''
		}
	}

	onLogin = ({ username, password }) => {
		axios.post('/db/login', { username, password })
			.then(res => {
				this.setState({ loggedIn: res.data, user: username })

				if (!res.data) {
					message.error('Invalid login information!')
				} else {
					message.success('Login successful!')
				}
			})
	}

	render = () => {
		if (!this.state.loggedIn) {
			return (
				<LoginPage onLogin={this.onLogin} />
			)
		}

		return (
			<div className='App'>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider collapsible collapsed={this.state.collapsed} onCollapse={(collapsed) => this.setState({ collapsed })}>
						<div className='App-logo'/>
						<Menu theme='dark' defaultSelectedKeys={['rooms']} mode='inline'>
							<Item key='something'>
								<Icon type='appstore-o' />
								<span>Something</span>
							</Item>
							<Item key='something-else'>
								<Icon type='tool' />
								<span>Something Else</span>
							</Item>
						</Menu>
					</Sider>
					<Content style={{ padding: 24 }}>
						<ContentViewer title='List' user={this.state.user}/>
					</Content>
				</Layout>
			</div>
		)
	}
}

export default App