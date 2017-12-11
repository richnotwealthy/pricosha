import React, {Component} from 'react'
import axios from 'axios'
import {Icon, Input, Card, Collapse, Row, Modal, Button, List, Select, Tag, Tooltip, message} from 'antd'
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
			currContentID: null,
			allPeople: [],
			taggee: null
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

		axios.post('/db/allPeople', { username: null })
			.then(res => {
				this.setState({ allPeople: res.data })
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
						style={{ width: '60%' }}
					/>
					<Button type='primary' onClick={this.addComment} style={{ width: '20%' }}>{'Submit'}</Button>
					<Button onClick={() => this.setState({ isCommenting: false })} style={{ width: '20%' }}>{'Cancel'}</Button>
				</div>
			)
		}

		return (
			<Button onClick={() => this.setState({ isCommenting: true })}>{'Add Comment'}</Button>
		)
	}

	addTag = () => {
		if (!this.state.taggee) {
			message.error('Please select a person to tag!')
			return
		}

		axios.post('/db/addTag', { id: this.state.currContentID, username_tagger: this.props.user, username_taggee: this.state.taggee })
			.then(res => {
				this.setState({ isCommenting: false, })
				axios.post('/db/contentInfo', { id: this.state.currContentID })
					.then(res => {
						this.setState({
							isTagging: false,
							tags: res.data.tags,
							comments: res.data.comments,
							newComment: '',
							taggee: null
						})
					})
			})
	}

	renderTagger = () => {
		if (this.state.isTagging) {
			return (
				<div>
					<Select
						placeholder='Select a Person'
						style={{ width: '60%' }}
						value={this.state.taggee}
						onChange={(taggee) => this.setState({ taggee })}
					>
						{this.state.allPeople.map((t, i) => {
							return (
								<Select.Option key={i} value={t.username}>{t.first_name + ' ' + t.last_name}</Select.Option>
							)
						})}
					</Select>
					<Button type='primary' onClick={this.addTag} style={{ width: '20%' }}>{'Submit'}</Button>
					<Button onClick={() => this.setState({ isTagging: false })} style={{ width: '20%' }}>{'Cancel'}</Button>
				</div>
			)
		}

		return (
			<div>
				<Button style={{ marginRight: 10 }} onClick={() => this.setState({ isTagging: true })}>Tag</Button>
				<span>{this.state.tags.map((t, i) => (
						<Tooltip key={i} title={'tagged by ' + t.username_tagger + ' at ' + t.timest}>
							<Tag>{t.username_taggee}</Tag>
						</Tooltip>
					)
				)}</span>
			</div>
		)
	}

	handleInputChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	deleteComment = (id, username, timest) => {
		return () => {
			timest = new Date(timest)
			timest = timest.getTime() - (timest.getTimezoneOffset() * 60000)
			axios.post('/db/deleteComment', { id, username, timest: new Date(timest).toISOString().slice(0, 19).replace('T', ' ') })
				.then(res => {
					axios.post('/db/contentInfo', { id: id })
						.then(res => {
							this.setState({
								currContentID: id,
								tags: res.data.tags,
								comments: res.data.comments,
							})
						})
				})
		}
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
					closable={false}
					footer={(<Button type='primary' onClick={() => this.setState({ modalVisible: false })}>Ok</Button>)}
		        >
					<List
						header={this.renderTagger()}
						footer={this.renderCommenter()}
						dataSource={this.state.comments}
						renderItem={c => (
							<Tooltip title={'at ' + c.timest}>
								<List.Item>
									<span>{c.username + ': ' + c.comment_text}</span>
									{c.username === this.props.user
										&& (<Button
												onClick={this.deleteComment(c.id, c.username, c.timest)}
												type='dashed'
												style={{ marginLeft: 10, height: 20 }}
											>
												<Icon type="close" />
											</Button>)
									}
								</List.Item>
							</Tooltip>
						)}
					/>
				</Modal>
			</div>
		)
	}
}

export default ContentViewer