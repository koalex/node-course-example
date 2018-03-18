import React                                            from 'react';
import PropTypes                                        from 'prop-types';
import { connect }                                      from 'react-redux';
import { submit, formChange }                           from '../../actionCreators/signin';
import { getSigninForm }                                from './selector';
import SigninForm                                       from './index';

@connect(state => {
	const signin = getSigninForm(state);
	return { signin };
})
export default class extends React.Component {

	state = {
		login: '',
		password: ''
	};

	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		signin: PropTypes.object.isRequired
	};

	componentDidUpdate(prevProps, prevState) {}

	componentDidMount () {}

	handleChange = name => ev => {
		this.props.dispatch(formChange(name));

		if (['login', 'password'].some(v => v == name)) {
			this.setState({
				[name]: ev.target.value
			});
		}
	};

	handleSubmit = ev => {
		ev.preventDefault();
		let credentials = {
			login: this.state.login.trim(),
			password: this.state.password.trim()
		};

		this.props.dispatch(submit(credentials));
	};

	render () {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%'
			}}>
				<SigninForm
					disabled={this.props.signin.get('disabled')}
					login={this.props.signin.get('login')}
					loginErr={this.props.signin.get('loginErr')}
					password={this.props.signin.get('password')}
					passwordErr={this.props.signin.get('passwordErr')}
					showPassword={this.props.signin.get('showPassword')}
					handleChange={this.handleChange}
					handleSubmit={this.handleSubmit}
				/>
			</div>
		);
	}
}