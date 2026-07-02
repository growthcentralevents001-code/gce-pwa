module.exports = {
  apps: [
    {
      name: 'gce-dev',
      cwd: '/root/gce-pwa-dev',
      script: 'npm',
      args: 'start',
      env: { PORT: '3000', NODE_ENV: 'production' },
    },
    {
      name: 'gce-prod',
      cwd: '/root/gce-pwa-prod',
      script: 'npm',
      args: 'start',
      env: { PORT: '3001', NODE_ENV: 'production' },
    },
  ],
};
