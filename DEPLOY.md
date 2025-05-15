# CxOneGo Frontend Production Deployment Guide

This guide explains how to deploy the CxOneGo frontend application using PM2 in a production environment.

## Prerequisites

- Node.js 14+ and npm installed
- PM2 installed globally (`npm install -g pm2`)
- Git (for clone/pull operations)

## Initial Deployment Steps

1. **Clone the repository**:
   ```bash
   git clone [your-repo-url]
   cd cxonego-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will also automatically build the project thanks to the `postinstall` script.

3. **Start the application with PM2**:
   ```bash
   npm run pm2:start:production
   ```

4. **Configure PM2 to auto-start on system boot**:
   ```bash
   npm run pm2:startup
   npm run pm2:save
   ```

## Updating the Application

1. **Pull the latest code**:
   ```bash
   git pull
   ```

2. **Install dependencies and rebuild**:
   ```bash
   npm install
   npm run build
   ```

3. **Restart the application**:
   ```bash
   npm run pm2:restart
   ```

## Common PM2 Commands

All these commands are available as npm scripts:

- **Start the application**: `npm run pm2:start`
- **Start with production environment**: `npm run pm2:start:production`
- **Restart the application**: `npm run pm2:restart`
- **Stop the application**: `npm run pm2:stop`
- **Delete the application from PM2**: `npm run pm2:delete`
- **View logs**: `npm run pm2:logs`
- **Monitor the application**: `npm run pm2:monitor`
- **Check status**: `npm run pm2:status`
- **Save current process list**: `npm run pm2:save`

## Troubleshooting

### Application Not Starting

Check the logs:
```bash
npm run pm2:logs
```

### Server Running But Application Not Accessible

1. Verify the server is running on the correct port:
   ```bash
   npm run pm2:status
   ```

2. Check firewall settings to ensure the port (default: 5173) is open.

3. Ensure your EC2 security group allows inbound traffic on the port.

### Performance Issues

1. Check memory usage:
   ```bash
   npm run pm2:monitor
   ```

2. Adjust the `max_memory_restart` value in `ecosystem.config.js` if needed.

## Nginx Configuration (Recommended)

For production, it's highly recommended to use Nginx as a reverse proxy in front of the Node.js server:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Setup with Certbot

If you need HTTPS (which is highly recommended):

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

The application uses the following environment variables:

- `PORT`: The port on which the server will run (default: 5173)
- `NODE_ENV`: Should be set to "production" for production deployments
- `API_URL`: The URL of your backend API

These can be configured in the `ecosystem.config.js` file.

## Support

For additional support, please contact your system administrator or the development team. 