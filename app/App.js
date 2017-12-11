import './App.css'
import React, {Component} from 'react'
import axios from 'axios'
import ContentViewer from './components/ContentViewer'
import ContentAdder from './components/ContentAdder'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import FriendsList from './components/FriendsList'
import TagManager from './components/TagManager'
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

	onSignup = ({ username, first_name, last_name, password }) => {
		if (!username || !first_name || !last_name || !password) {
			message.error('All fields required!')
		} else {
			axios.post('/db/createAccount', { username, first_name, last_name, password })
				.then(res => {
					if (!res.data) {
						message.error('Username already exists!')
					} else {
						message.success('Account created!')
						this.setState({ loggedIn: res.data, user: username, page: 'content-view' })
					}
				})
		}
	}

	onPageSelect = ({ item, key, selectedKeys }) => {
		this.setState({
			page: key
		})
	}

	pageChange = (page) => this.setState({ page })

	render() {
		if (this.state.page === 'signup') {
			return (
				<SignupPage onSignup={this.onSignup} pageChange={this.pageChange} />
			)
		} else if (!this.state.loggedIn) {
			return (
				<LoginPage onLogin={this.onLogin} pageChange={this.pageChange} />
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
								<span>View Content</span>
							</Item>
							<Item key='content-add'>
								<Icon type='plus-circle-o' />
								<span>Add Content</span>
							</Item>
							<Item key='friends'>
								<Icon type='smile-o' />
								<span>Friends</span>
							</Item>
							<Item key='tag-manager'>
								<Icon type='exclamation-circle-o' />
								<span>Tags</span>
							</Item>
						</Menu>
					</Sider>
					<Content style={{ padding: 24 }}>
						{this.state.page === 'content-view' && <ContentViewer title='Content' user={this.state.user}/>}
						{this.state.page === 'content-add' && <ContentAdder title='Add Content' user={this.state.user}/>}
						{this.state.page === 'friends' && <FriendsList title='Manage Friends' user={this.state.user}/>}
						{this.state.page === 'tag-manager' && <TagManager title='Manage Tags' user={this.state.user}/>}
					</Content>
				</Layout>
			</div>
		)
	}
}

export default App