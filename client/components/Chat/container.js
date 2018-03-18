import React                      from 'react';
import PropTypes                  from 'prop-types';
import { connect }                from 'react-redux';
import dispatch                   from '../../actionCreators/dispatch';
import { signout, signoutGlobal } from '../../actionCreators/signout';
import { sendMessage }            from '../../actionCreators/chat';
import Chat                       from './index';

@connect(state => {
	const chat = state.get('chat');
	return { chat };
}, {
	dispatch
})
export default class extends React.Component {
	static propTypes = {
		chat: PropTypes.object,
		socket: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
	};

	componentDidMount () {}

	signout = () => {
		this.props.dispatch(signout());
	};

	signoutGlobal = () => {
		this.props.dispatch(signoutGlobal());
	};

	render () {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%'
			}}>
				<Chat
					signout={this.signout}
					signoutGlobal={this.signoutGlobal}
				/>
			</div>
		);
	}
}