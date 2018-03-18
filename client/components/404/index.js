import CSS            from './index.styl';
import React          from 'react';
import { withRouter } from 'react-router-dom';
import Typography     from 'material-ui/Typography';

const NotFound = withRouter(props => {
	return (<div>
			<Typography type="headline" component="h1" style={{textAlign: 'center'}}>
				<span className={CSS['not-found']}>404</span>
			</Typography>
			<Typography  type="body1" component="p" style={{textAlign: 'center'}}>
				<span className={CSS['not-found__uri']}>
					{`${props.location.pathname}${props.location.search || ''}`}
				</span>
			</Typography>
		</div>);
});

export default NotFound;
