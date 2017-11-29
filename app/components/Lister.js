import React, {Component} from 'react'
import {Card, Collapse} from 'antd'
const {Panel} = Collapse

const sampleData = [
	{ name: 'asdf', status: 'adfas' },
	{ name: '1234', status: 'asdf' },
	{ name: '63a', status: 'y5h3q' },
	{ name: '1325g', status: '3q5' },
]

class Lister extends Component {
	renderRows() {
		return sampleData.map((t, i) => {
			return (
				<Panel key={i} header={t.name}>
					{t.name}
				</Panel>
			)
		})
	}

	render() {
		return (
			<Card title={this.props.title}>
				<Collapse>
					{this.renderRows()}
				</Collapse>
			</Card>
		)
	}
}

export default Lister