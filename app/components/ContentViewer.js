import React, {Component} from 'react'
import axios from 'axios'
import {Input, Card, Collapse, Row, Modal, Button, List, Select, message} from 'antd'
const {Panel} = Collapse

class ContentViewer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data: [],
			contentTitle: '',
			tags: [],
			comments: [],
			modalVisible: false,
			isCommenting: false,
			newComment: '',
			currContentID: null
		}
	}

	componentDidMount() {
		axios.post('/db/userContent', { user: this.props.user })
			.then(res => {
				this.setState({
					data: res.data.sort((a, b) => {
						return a.timest < b.timest
					})
				})
			})
	}

	infoModal = (id, title) => {
		return () =>
			axios.post('/db/contentInfo', { id: id })
				.then(res => {
					this.setState({
						currContentID: id,
						tags: res.data.tags,
						comments: res.data.comments,
						contentTitle: title,
						modalVisible: true
					})
				})
	}

	renderRows = () => {
		return this.state.data.map((t, i) => {
			const title = t.first_name + ' ' + t.last_name + ' - ' + t.content_name
			return (
				<Panel key={t.id} header={title}>
					<Row>{t.file_path}</Row>
					<Row>
						<Button onClick={this.infoModal(t.id, title)}>More Info</Button>
					</Row>
				</Panel>
			)
		})
	}

	addComment = () => {
		if (!this.state.newComment) {
			message.error('Please enter a comment!')
			return
		}

		axios.post('/db/addComment', { id: this.state.currContentID, username: this.props.user, comment_text: this.state.newComment })
			.then(res => {
				this.setState({ isCommenting: false, })
				axios.post('/db/contentInfo', { id: this.state.currContentID })
					.then(res => {
						this.setState({
							isCommenting: false,
							tags: res.data.tags,
							comments: res.data.comments,
							newComment: ''
						})
					})
			})
	}

	renderCommenter = () => {
		if (this.state.isCommenting) {
			return (
				<div>
					<Input
						placeholder='New Comment'
						value={this.state.newComment}
						name='newComment'
						onChange={this.handleInputChange}
						style={{ width: '80%' }}
					/>
					<Button type='primary' onClick={this.addComment} style={{ width: '20%' }}>{'Submit'}</Button>
				</div>
			)
		}

		return (
			<Button onClick={() => this.setState({ isCommenting: true })}>{'Add Comment'}</Button>
		)
	}

	renderTagger = () => {
		if (this.state.isTagging) {
			return (
				<div>
					<Select
						placeholder='Select a Person'
						style={{ width: '100%' }}
						value={this.state.person}
						onChange={(person) => this.setState({ person })}
					>
						{this.state.allPeople.map((t, i) => {
							return (
								<Select.Option key={i} value={t.username}>{t.first_name + ' ' + t.last_name}</Select.Option>
							)
						})}
					</Select>
					<Button type='primary' onClick={this.addTag} style={{ width: '20%' }}>{'Submit'}</Button>
				</div>
			)
		}
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
						{this.renderRows()}
					</Collapse>
				</Card>
				<Modal
		        	title={this.state.contentTitle}
		        	visible={this.state.modalVisible}
					footer={(<Button type='primary' onClick={() => this.setState({ modalVisible: false })}>Ok</Button>)}
		        >
					<List
						header={this.renderTagger()}
						footer={this.renderCommenter()}
						dataSource={this.state.comments}
						renderItem={c => (<List.Item>{JSON.stringify(c)}</List.Item>)}
					/>
				</Modal>
			</div>
		)
	}
}

export default ContentViewer