import './App.css'
import React, {Component} from 'react'
import Lister from './components/Lister'
import {Layout, Menu, Icon} from 'antd'
const {Content, Sider} = Layout
const {Item} = Menu

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			collapsed: false
		}
	}

	render() {
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
						<Lister title='List' />
					</Content>
				</Layout>
			</div>
		)
	}
}

export default App