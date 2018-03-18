import React                                    from 'react';
import PropTypes                                from 'prop-types';
import Input, { InputLabel, InputAdornment }    from 'material-ui/Input';
import { FormControl, FormHelperText }          from 'material-ui/Form';
import IconButton                               from 'material-ui/IconButton';
import Button                                   from 'material-ui/Button';
import Visibility                               from 'material-ui-icons/Visibility';
import VisibilityOff                            from 'material-ui-icons/VisibilityOff';
import { Link }                                 from 'react-router-dom';
import toJS                                     from '../HOC/toJS'

function SigninForm (props) {
	return (
		<form style={{ display: 'inline-block' }} onSubmit={props.handleSubmit}>

			<FormControl
				fullWidth={true}
				error={!!props.loginErr}
				disabled={props.disabled}
			>
				<InputLabel htmlFor="login">Логин или email</InputLabel>
				<Input
					id="login"
					type="text"
					defaultValue={props.password}
					onChange={props.handleChange('login')}
				/>
				<FormHelperText>{props.loginErr || ' '}</FormHelperText>
			</FormControl>
			<br/>
			<br/>
			<br/>
			<FormControl
				fullWidth={true}
			    error={!!props.passwordErr}
				disabled={props.disabled}
			>
				<InputLabel htmlFor="password">Пароль</InputLabel>
				<Input
					id="password"
					type={props.showPassword ? 'text' : 'password'}
					defaultValue={props.password}
					onChange={props.handleChange('password')}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								onClick={props.handleChange('showPassword')}
							>
								{props.showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
				<FormHelperText>{props.passwordErr || ' '}</FormHelperText>
			</FormControl>
			<br/>
			<br/>
			<br/>
			<Button
				fullWidth={true}
				disabled={props.disabled}
				color="primary"
				type="submit"
			>
				Войти в чат
			</Button>

			<br/>
			<br/>

			<div style={{textAlign: 'center'}}>
				<Link to="/signup">
					Регистрация
				</Link>
			</div>
		</form>
	);

}

SigninForm.propTypes = {
	disabled: PropTypes.bool,
	login: PropTypes.string,
	loginErr: PropTypes.string,
	password: PropTypes.string,
	passwordErr: PropTypes.string,
	showPassword: PropTypes.bool,
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

export default toJS(SigninForm);