const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
// Azure App Service provides port via process.env.PORT
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing
app.use(express.json());

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Application startTime for uptime calculation
const startTime = new Date();

// API 1: Health check endpoint (for Azure App Service Health Check feature)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((new Date() - startTime) / 1000)
  });
});

// API 2: App Status & System Metrics
app.get('/api/status', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memoryUsagePercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);
  const processMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

  res.json({
    app: {
      name: 'Azure App Service Demo',
      version: '1.0.0',
      status: 'Online',
      uptimeSeconds: Math.floor((new Date() - startTime) / 1000),
      environment: process.env.NODE_ENV || 'production'
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memoryUsagePercent: `${memoryUsagePercent}%`,
      heapUsedMb: `${processMemory} MB`,
      hostname: os.hostname()
    },
    azure: {
      isAzureAppService: !!process.env.WEBSITE_SITE_NAME,
      siteName: process.env.WEBSITE_SITE_NAME || 'Local Environment',
      region: process.env.REGION_NAME || 'Localhost',
      instanceId: process.env.WEBSITE_INSTANCE_ID ? `${process.env.WEBSITE_INSTANCE_ID.substring(0, 10)}...` : 'local-instance'
    }
  });
});

// API 3: Azure & Environment Information
app.get('/api/info', (req, res) => {
  res.json({
    nodeVersion: process.version,
    framework: 'Express.js',
    deploymentMethod: process.env.WEBSITE_SITE_NAME ? 'Azure App Service' : 'Local Node.js Engine',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for single-page app behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Azure App Service Demo App is running!`);
  console.log(`🌐 Server listening on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`☁️ Environment: ${process.env.WEBSITE_SITE_NAME ? 'Azure App Service' : 'Localhost'}`);
  console.log(`===================================================`);
});
