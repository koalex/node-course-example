import React                                            from 'react';
import PropTypes                                        from 'prop-types';
import { connect }                                      from 'react-redux';
import { submit, formChange }                           from '../../actionCreators/signup';
import { getSignupForm }                                from './selector';
import SignupForm                                       from './index';

@connect(state => {
	const signup = getSignupForm(state);
	return { signup };
})
export default class extends React.Component {

	state = {
		name: '',
		surname: '',
		login: '',
		email: '',
		password: '',
		passwordConfirmation: ''
	};

	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		signup: PropTypes.object.isRequired
	};

	componentDidUpdate(prevProps, prevState) {}

	componentDidMount () {}

	handleChange = name => ev => {
		this.props.dispatch(formChange(name));

		if (['name', 'surname', 'login', 'email', 'password', 'passwordConfirmation'].some(v => v == name)) {
			this.setState({
				[name]: ev.target.value
			});
		}
	};

	handleSubmit = ev => {
		ev.preventDefault();
		let credentials = {
			name: this.state.name.trim(),
			surname: this.state.surname.trim(),
			login: this.state.login.trim(),
			email: this.state.email.trim(),
			password: this.state.password.trim(),
			passwordConfirmation: this.state.passwordConfirmation.trim()
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
				<SignupForm
					disabled={this.props.signup.get('disabled')}
					name={this.props.signup.get('name')}
					nameErr={this.props.signup.get('nameErr')}
					surname={this.props.signup.get('surname')}
					surnameErr={this.props.signup.get('surnameErr')}
					email={this.props.signup.get('email')}
					emailErr={this.props.signup.get('emailErr')}
					login={this.props.signup.get('login')}
					loginErr={this.props.signup.get('loginErr')}
					password={this.props.signup.get('password')}
					passwordErr={this.props.signup.get('passwordErr')}
					passwordConfirmation={this.props.signup.get('passwordConfirmation')}
					passwordConfirmationErr={this.props.signup.get('passwordConfirmationErr')}
					handleChange={this.handleChange}
					handleSubmit={this.handleSubmit}
				/>
			</div>
		);
	}
}