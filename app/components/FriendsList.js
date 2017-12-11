import React, {Component} from 'react'
import axios from 'axios'
import {Input, Icon, Card, Collapse, Row, Modal, Button, List, Select, message} from 'antd'
const {Panel} = Collapse

class FriendsList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			groupData: [],
			otherPeople: [],
			allPeople: [],
			person: null,
			modalVisible: false,
			modalFGVisible: false,
			fgname: null,
			fgdes: null,
			currGroup: null
		}
	}

	componentDidMount() {
		this.getFriends()

		axios.post('/db/allPeople', { username: this.props.user })
			.then(res => {
				this.setState({ allPeople: res.data })
			})
	}

	getFriends = () => {
		axios.post('/db/friendGroups', { username: this.props.user })
			.then(res => {
				let groups = res.data.map((t) => {
					return new Promise((resolve, reject) => {
						axios.post('/db/friends', { username_creator: this.props.user, group_name: t.group_name })
							.then(res => {
								resolve({ group_name: t.group_name, description: t.description, friends: res.data })
							})
					})
				})

				Promise.all(groups).then((groupData) => {
					this.setState({ groupData, modalVisible: false, modalFGVisible: false, person: null })
				})
			})
	}

	getOtherPeople = (group) => {
		return () => {
			axios.post('/db/otherPeople', { username: this.props.user, group_name: group })
				.then(res => {
					this.setState({ modalVisible: true, currGroup: group, otherPeople: res.data })
				})
		}
	}

	renderGroups = () => {
		return this.state.groupData.map((t, i) => {
			const group = t.group_name
			return (
				<Panel key={i} header={group + ' - ' + t.description}>
					<List
				    	footer={<Button onClick={this.getOtherPeople(group)}>Add Friend</Button>}
				    	bordered
				    	dataSource={t.friends}
				    	renderItem={item => (<List.Item>{item.first_name + ' ' + item.last_name}</List.Item>)}
				    />
				</Panel>
			)
		})
	}

	addFriend = () => {
		const { person, currGroup } = this.state

		axios.post('/db/addFriend', {
			username_creator: this.props.user,
			group_name: currGroup,
			username: person
		}).then(res => {
			this.getFriends()
		})
	}

	addFriendGroup = () => {
		const { fgname, fgdes, person } = this.state

		const groupData = this.state.groupData.map(t => t.group_name)

		if (groupData.indexOf(fgname) !== -1) {
			message.error('You already have a FriendGroup with that name!')
			return
		} else if (!fgname || !fgdes || !person) {
			message.error('All fields required!')
			return
		}

		axios.post('/db/addFriendGroup', {
			username: this.props.user,
			group_name: fgname,
			description: fgdes,
			person
		}).then(res => {
			this.getFriends()
		})
	}

	handleInputChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		return (
			<div>
				<Card title={this.props.title}>
					<Collapse>
						{this.renderGroups()}
					</Collapse>
					<Button onClick={() => this.setState({ modalFGVisible: true })}>Add FriendGroup</Button>
				</Card>
				<Modal
		        	title={'Add a Friend to ' + this.state.currGroup}
		        	visible={this.state.modalVisible}
		        	onOk={this.addFriend}
		        	onCancel={() => this.setState({ modalVisible: false })}
		        >
					<Select
						style={{ width: '100%' }}
						value={this.state.person}
						placeholder='Select Person'
						onChange={(person) => this.setState({ person })}
					>
						{this.state.otherPeople.map((t, i) => {
							return (
								<Select.Option key={i} value={t.username}>{t.first_name + ' ' + t.last_name}</Select.Option>
							)
						})}
					</Select>
				</Modal>
				<Modal
		        	title={'Add a FriendGroup'}
		        	visible={this.state.modalFGVisible}
		        	onOk={this.addFriendGroup}
		        	onCancel={() => this.setState({ modalFGVisible: false })}
		        >
					<Input
						prefix={<Icon type='usergroup-add' style={{ fontSize: 13 }} />}
						placeholder='Name'
						value={this.state.fgname}
						name='fgname'
						onChange={this.handleInputChange}
						style={{ width: '100%' }}
					/>
					<Input
						prefix={<Icon type='info-circle-o' style={{ fontSize: 13 }} />}
						placeholder='Description'
						value={this.state.fgdes}
						name='fgdes'
						onChange={this.handleInputChange}
						style={{ width: '100%' }}
					/>
					<Select
						style={{ width: '100%' }}
						value={this.state.person}
						placeholder='Select Person'
						onChange={(person) => this.setState({ person })}
					>
						{this.state.allPeople.map((t, i) => {
							return (
								<Select.Option key={i} value={t.username}>{t.first_name + ' ' + t.last_name}</Select.Option>
							)
						})}
					</Select>
				</Modal>
			</div>
		)
	}
}

export default FriendsList