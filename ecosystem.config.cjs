module.exports = {
  apps: [
    {
      name: "cxonego-frontend",
      script: "server.cjs",
      instances: 1,         // Changed from "max" to 1 to limit to a single instance
      exec_mode: "fork",    // Changed to "fork" since we're using a single instance
      watch: false,         // Don't watch for file changes in production
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      
      // Environment variables
      env: {
        NODE_ENV: "production",
        PORT: 5173,
        NODE_OPTIONS: "--max-old-space-size=4096"
      },
      
      // Error and out logs
      error_file: "logs/error.log",
      out_file: "logs/output.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      
      // Merge logs 
      merge_logs: true,
      
      // Restart behavior
      autorestart: true,      // Restart if app crashes
      max_restarts: 10,       // Maximum number of restarts on crash
      restart_delay: 4000,    // Delay between restarts (4 seconds)
      
      // Graceful shutdown
      kill_timeout: 3000,     // Give app 3 seconds to handle connections before killing
      wait_ready: false,      // Changed from true to false - don't wait for ready signal
      listen_timeout: 10000,  // Wait 10 seconds for app to start
      
      // Performance monitoring
      source_map_support: false,
      
      // Advanced settings
      node_args: "--max-old-space-size=4096", // Increase Node.js memory limit to 4GB
      
      // Enhanced monitoring metrics
      instance_var: "INSTANCE_ID",
      
      // Deployment environment variables
      env_production: {
        NODE_ENV: "production",
        PORT: 5173,
        API_URL: "http://api.cxonego.me/api/v1/",  // Your API URL from .env
        NODE_OPTIONS: "--max-old-space-size=4096"
      },
      
      // Optional development environment (if needed)
      env_development: {
        NODE_ENV: "development",
        PORT: 5173,
        API_URL: "http://localhost:8000/api/v1/",
        NODE_OPTIONS: "--max-old-space-size=4096"
      }
    }
  ],

  // Optional deployment configuration if you want to use PM2 for deployment
  deploy: {
    production: {
      user: "ubuntu",
      host: ["13.235.48.242"],  // Your EC2 instance IP
      ref: "origin/main",
      repo: "git@github.com:yourusername/cxonego-frontend.git",  // Your repo URL
      path: "/home/ubuntu/cxonego-frontend",
      "post-deploy": "export NODE_OPTIONS='--max-old-space-size=4096' && npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env production"
    }
  }
} 