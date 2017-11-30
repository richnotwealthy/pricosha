import React, {Component} from 'react'
import axios from 'axios'
import {Card, Collapse, Row, Modal, Button} from 'antd'
const {Panel} = Collapse

class ContentViewer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data: []
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
					console.log(res.data)
					Modal.info({
						title: title,
						content: (
							<div>
								<p>{JSON.stringify(res.data.tags)}</p>
								<p>{JSON.stringify(res.data.comments)}</p>
							</div>
						),
						width: '75%',
						onOk() {},
					});
				})
	}

	render() {
		return (
			<div>
				<Card title={this.props.title}>
					<Collapse>
						{
							this.state.data.map((t, i) => {
								const title = t.first_name + ' ' + t.last_name + ' - ' + t.content_name
								return (
									<Panel key={t.id} header={title}>
										<Row>{t.file_path}</Row>
										<Row><Button onClick={this.infoModal(t.id, title)}>More Info</Button></Row>
									</Panel>
								)
							})
						}
					</Collapse>
				</Card>
			</div>
		)
	}
}

export default ContentViewer