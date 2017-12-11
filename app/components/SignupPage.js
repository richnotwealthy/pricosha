import React, {Component} from 'react'
import {Card, Row, Input, Button, Icon} from 'antd'

class SignupPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: '',
			password: '',
			first_name: '',
			last_name: ''
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
						prefix={<Icon type="right" style={{ fontSize: 13 }} />}
						placeholder='First Name'
						value={this.state.first_name}
						name='first_name'
						onChange={this.handleInputChange}
						style={{ width: '100%' }}
					/>
				</Row>
				<Row>
					<Input
						prefix={<Icon type="right" style={{ fontSize: 13 }} />}
						placeholder='Last Name'
						value={this.state.last_name}
						name='last_name'
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
					<Button type='primary' onClick={() => this.props.onSignup(this.state)}>Create</Button>
					<Button onClick={() => this.props.pageChange('content-view')}>Cancel</Button>
				</Row>
			</Card>
		)
	}
}

export default SignupPage