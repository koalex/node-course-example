import React                from 'react';
import { CircularProgress } from 'material-ui/Progress';

export default ({ size = 120, thickness = 2, ...props }) => {
	return (
		<div
			style={{
				position: 'fixed',
				top: `calc(50% - ${size / 2}px)`,
				left: `calc(50% - ${size / 2}px)`,
				zIndex: 99999,
				overflow: 'visible'
			}}
		>
			<CircularProgress size={size} thickness={thickness} {...props} />
		</div>
	);
}
