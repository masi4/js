config.routes = {
	'/users/login': ['users', 'login'],
	'/users/welcome': ['users', 'welcome'],
	'/users/join': ['users', 'join'],
	'/users/logout': ['users', 'logout'],

	'/spaces/([0-9a-f]+)/notes': ['notes', 'index'],
	'/spaces/([0-9a-f]+)/boards': ['boards', 'index'],
	'/spaces/([0-9a-f]+)/boards/([0-9a-f]+)/notes': ['boards', 'notes'],

	'/settings': ['settings', 'index'],
	'/settings/password': ['settings', 'password'],
	'/settings/delete-account': ['settings', 'delete_account'],

	'/sync': ['sync', 'index'],

	'/feedback': ['feedback', 'index'],

	'/': ['notes', 'index']
};

