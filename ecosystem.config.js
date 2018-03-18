module.exports = {
	apps: [
	{
		name: "SERVER",
		script: "server.js",
		exec_mode: "cluster",
		instances: -1,
		merge_logs: true,
		error_file: "./logs/pm2_error.log",
		out_file: "./logs/pm2_out.log",
		pid_file: "./logs/pm2_id.pid",
		max_memory_restart: "1G",
		autorestart: true,
		watch: false,
		env: {
			"COMMON_VARIABLE": "true"
		},
		env_production: {
			"NODE_ENV": "production",
			"NODE_CONFIG_STRICT_MODE": false,
			"PORT": 3000
		}
	}
],

	deploy: {

	}
};
