import React, {Component} from 'react'
import {Card, Row, Input, Button, Icon} from 'antd'

class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: '',
			password: ''
		}
	}

	handleInputChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		return (
			<Card style={{ marginLeft: '20%', marginRight: '20%', marginTop: '10%', borderRadius: 10 }}>
				<Row>
					<Input
						prefix={<Icon type='user' style={{ fontSize: 13 }} />}
						placeholder='Username'
						value={this.state.username}
						name='username'
						onChange={this.handleInputChange}
						style={{ width: '100%' }}
					/>
				</Row>
				<Row>
					<Input
						prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
						placeholder='Password'
						value={this.state.password}
						name='password'
						type='password'
						onChange={this.handleInputChange}
						style={{ width: '100%' }}
					/>
				</Row>
				<Row>
					<Button type='primary' onClick={() => this.props.onLogin(this.state)}>Login</Button>
				</Row>
			</Card>
		)
	}
}

export default LoginPage