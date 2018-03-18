import React                           from 'react';
import PropTypes                       from 'prop-types';
import Input, { InputLabel }           from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Button                          from 'material-ui/Button';
import { Link }                        from 'react-router-dom';
import toJS                            from '../HOC/toJS'


const RenderFiled = ({formControl, input, inputLabel, formHelperText}) => {
	return (
		<FormControl
			fullWidth={true}
			{...formControl}
		>
			<InputLabel {...inputLabel} />
			<Input
				{...input}
			/>
			<FormHelperText {...formHelperText} />
		</FormControl>
	);
};

function SignupForm (props) {
	return (
		<form style={{ display: 'inline-block' }} onSubmit={props.handleSubmit}>

			<RenderFiled
				formControl={{
					error: !!props.nameErr,
					disabled: props.disabled
				}}
				input={{
					id: 'name',
					type: 'text',
					onChange: props.handleChange('name')
				}}
				inputLabel={{
					htmlFor: 'name',
					children: 'Имя'
				}}
				formHelperText={{
					children: props.nameErr || ' '
				}}
			/>
			<br/>
			<br/>
			<RenderFiled
				formControl={{
					error: !!props.surnameErr,
					disabled: props.disabled
				}}
				input={{
					id: 'surname',
					type: 'text',
					onChange: props.handleChange('surname')
				}}
				inputLabel={{
					htmlFor: 'surname',
					children: 'Фамилия'
				}}
				formHelperText={{
					children: props.surnameErr || ' '
				}}
			/>
			<br/>
			<br/>
			<RenderFiled
				formControl={{
					error: !!props.loginErr,
					disabled: props.disabled
				}}
				input={{
					id: 'login',
					type: 'text',
					onChange: props.handleChange('login')
				}}
				inputLabel={{
					htmlFor: 'login',
					children: 'Логин'
				}}
				formHelperText={{
					children: props.loginErr || ' '
				}}
			/>
			<br/>
			<br/>
			<RenderFiled
				formControl={{
					error: !!props.emailErr,
					disabled: props.disabled
				}}
				input={{
					id: 'email',
					type: 'text',
					onChange: props.handleChange('email')
				}}
				inputLabel={{
					htmlFor: 'email',
					children: 'Email'
				}}
				formHelperText={{
					children: props.emailErr || ' '
				}}
			/>
			<br/>
			<br/>
			<RenderFiled
				formControl={{
					error: !!props.passwordErr,
					disabled: props.disabled
				}}
				input={{
					id: 'password',
					type: 'password',
					onChange: props.handleChange('password')
				}}
				inputLabel={{
					htmlFor: 'password',
					children: 'Пароль'
				}}
				formHelperText={{
					children: props.passwordErr || ' '
				}}
			/>
			<br/>
			<br/>
			<RenderFiled
				formControl={{
					error: !!props.passwordConfirmationErrErr,
					disabled: props.disabled
				}}
				input={{
					id: 'passwordConfirmationErr',
					type: 'password',
					onChange: props.handleChange('passwordConfirmation')
				}}
				inputLabel={{
					htmlFor: 'passwordConfirmationErr',
					children: 'Пароль ещё раз'
				}}
				formHelperText={{
					children: props.passwordConfirmationErrErr || ' '
				}}
			/>
			<br/>
			<br/>
			<Button
				fullWidth={true}
				disabled={props.disabled}
				color="primary"
				type="submit"
			>
				Зарегистрироваться
			</Button>

			<br/>
			<br/>

			<div style={{textAlign: 'center'}}>
				<Link to="/signin">
					Вход в чат
				</Link>
			</div>
		</form>
	);

}

SignupForm.propTypes = {
	disabled: PropTypes.bool,
	name: PropTypes.string,
	nameErr: PropTypes.string,
	surname: PropTypes.string,
	surnameErr: PropTypes.string,
	login: PropTypes.string,
	loginErr: PropTypes.string,
	email: PropTypes.string,
	emailErr: PropTypes.string,
	password: PropTypes.string,
	passwordErr: PropTypes.string,
	passwordConfirmation: PropTypes.string,
	passwordConfirmationErr: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired
};

export default toJS(SignupForm);