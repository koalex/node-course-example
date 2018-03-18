'use strict';

import React from 'react';

const License = WrappedComponent => wrappedComponentProps => {

	const license = wrappedComponentProps ? wrappedComponentProps.license : null;
	const rbac    = wrappedComponentProps ? wrappedComponentProps.rbac : null;
	const release = wrappedComponentProps ? wrappedComponentProps.release : null;

	// if (__LICENSE__)

	const propsJS = wrappedComponentProps;

	return <WrappedComponent {...propsJS} />
};

export default () => {};