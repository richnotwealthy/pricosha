import React, {Component} from 'react'
import axios from 'axios'
import {Card, Input, Checkbox, Select, Button} from 'antd'

class ContentAdder extends Component {
	constructor(props) {
		super(props)

		this.state = {
			caption: '',
			path: '',
			isPublic: true,
			groups: [],
			groupData: []
		}
	}

	componentDidMount() {
		axios.post('/db/friendGroups', { username: this.props.user })
			.then(res => {
				this.setState({ groupData: res.data })
			})
	}

	render() {
		return (
			<Card>
				<Input
					name='caption'
					placeholder='Caption'
					value={this.state.caption}
					onChange={(e) => this.setState({ caption: e.target.value })}
				/>
				<Input
					name='path'
					placeholder='Path'
					value={this.state.path}
					onChange={(e) => this.setState({ path: e.target.value })}
				/>
			<Checkbox checked={this.state.isPublic} onChange={(e) => this.setState({ isPublic: e.target.checked })}>Public</Checkbox>
				{!this.state.isPublic &&
					<Select
						mode='multiple'
						style={{ width: '100%' }}
						value={this.state.groups}
						placeholder='Select FriendGroups'
						onChange={(groups) => this.setState({ groups })}
					>
						{this.state.groupData.map((t, i) => {
							return (
								<Select.Option key={i} value={t.group_name}>{t.group_name}</Select.Option>
							)
						})}
					</Select>
				}
				<Button onClick={() => {
						axios.post('/db/postContent', {
							username: this.props.user,
							caption: this.state.caption,
							path: this.state.path,
							isPublic: this.state.isPublic ? 1 : 0,
							groups: this.state.groups
						})

						this.setState({
							caption: '',
							path: '',
							isPublic: true,
							groups: [],
						})
					}}>Post</Button>
			</Card>
		)
	}
}

export default ContentAdder