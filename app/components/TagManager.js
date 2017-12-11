import React, {Component} from 'react'
import axios from 'axios'
import {Input, Icon, Card, Collapse, Row, Modal, Button, List, Select, message} from 'antd'
const {Panel} = Collapse

class TagManager extends Component {
	constructor(props) {
		super(props)

		this.state = {
			tags: []
		}
	}

	componentDidMount() {
		this.getTags()
	}

	getTags = () => {
		axios.post('/db/getTags', { username: this.props.user })
			.then(res => {
				this.setState({
					tags: res.data
				})
			})
	}

	acceptTag = (id, username_tagger, username_taggee) => {
		return  () => {
			axios.post('/db/acceptTag', { id, username_tagger, username_taggee })
			.then(res => this.getTags())
		}
	}

	rejectTag = (id, username_tagger, username_taggee) => {
		return  () => {
			axios.post('/db/rejectTag', { id, username_tagger, username_taggee })
			.then(res => this.getTags())
		}
	}

	render() {
		return (
			<Card title={this.props.title}>
				<List
					dataSource={this.state.tags}
					renderItem={t => (
						<List.Item>
							<span>{JSON.stringify(t)}</span>
							<Button type='primary' style={{ marginLeft: 10 }} onClick={this.acceptTag(t.id, t.username_tagger, this.props.user)}>Accept</Button>
							<Button type='danger' style={{ marginLeft: 10 }} onClick={this.rejectTag(t.id, t.username_tagger, this.props.user)}>Reject</Button>
						</List.Item>
					)}
				/>
			</Card>
		)
	}
}

export default TagManager