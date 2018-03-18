import React                                                     from 'react';
import PropTypes                                                 from 'prop-types';
import AppBar                                                    from 'material-ui/AppBar';
import Toolbar                                                   from 'material-ui/Toolbar';
import TextField                                                 from 'material-ui/TextField';
import Button                                                    from 'material-ui/Button';
import IconButton                                                from 'material-ui/IconButton';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar                                                    from 'material-ui/Avatar';
import Tooltip                                                   from 'material-ui/Tooltip';
import Typography                                                from 'material-ui/Typography';
import SignoutIcon                                               from 'material-ui-icons/ExitToApp';
import ExitAllIcon                                               from 'material-ui-icons/PhonelinkOff';
import toJS                                                      from '../HOC/toJS'

function Chat (props) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar style={{ justifyContent: 'space-between' }}>
					<Typography variant="title" color="inherit">
						ЧАТ
					</Typography>
					<div>
						<Tooltip
							title="Выйти"
							leaveDelay={300}
							placement="bottom"
						>
							<IconButton
								aria-haspopup="true"
								color="inherit"
								onClick={props.signout}
							>
								<SignoutIcon />
							</IconButton>
						</Tooltip>
						&nbsp;
						<Tooltip
							title="Выйти со всех устройств"
							leaveDelay={300}
							placement="bottom"
						>
							<IconButton
								aria-haspopup="true"
								color="inherit"
								onClick={props.signoutGlobal}
							>
								<ExitAllIcon />
							</IconButton>
						</Tooltip>

					</div>
				</Toolbar>
			</AppBar>
			<div style={{ maxHeight: 'calc(100vh - 245px)', overflowY: 'auto' }}>
				<List>

					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem divider>
						<Avatar>
							DA
						</Avatar>
						<ListItemText primary="Василий Иванович" secondary="Привет, как дела ?" />
						<ListItemSecondaryAction>
							July 20, 2014
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem divider>
						<ListItemText primary="ВЫ" secondary="Это мой текст" />
						<ListItemSecondaryAction>
							July 21, 2014
						</ListItemSecondaryAction>
					</ListItem>

				</List>
			</div>
			<hr/>
			<form>
				<TextField
					fullWidth={true}
					label="Введите ссобщение"
					multiline
					rowsMax="4"
					onChange={() => {}}
					margin="normal"
				/>
				<br/>
				<Button disabled fullWidth={true} color="primary" variant="raised" >
					Отправить
				</Button>

			</form>
		</div>

	);

}

Chat.propTypes = {
	signout: PropTypes.func.isRequired,
	signoutGlobal: PropTypes.func.isRequired
};

export default toJS(Chat);