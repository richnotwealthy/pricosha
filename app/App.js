import './App.css'
import React, {Component} from 'react'
import axios from 'axios'
import ContentViewer from './components/ContentViewer'
import ContentAdder from './components/ContentAdder'
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
			user: '',
			page: 'content-view'
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

	onPageSelect = ({ item, key, selectedKeys }) => {
		this.setState({
			page: key
		})
	}

	render() {
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
						<Menu theme='dark' defaultSelectedKeys={['content-view']} mode='inline' onSelect={this.onPageSelect}>
							<Item key='content-view'>
								<Icon type='appstore-o' />
								<span>View</span>
							</Item>
							<Item key='content-add'>
								<Icon type='plus-circle' />
								<span>Add</span>
							</Item>
						</Menu>
					</Sider>
					<Content style={{ padding: 24 }}>
						{this.state.page === 'content-view' && <ContentViewer title='Content' user={this.state.user}/>}
						{this.state.page === 'content-add' && <ContentAdder title='Add' user={this.state.user}/>}
					</Content>
				</Layout>
			</div>
		)
	}
}

export default App