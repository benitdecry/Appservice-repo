# ☁️ Azure App Service & GitHub Ready Node.js Web Application

A lightweight, modern, production-ready Node.js Express application styled with a sleek glassmorphic dashboard interface. Designed for seamless upload to GitHub and automated CI/CD deployment to **Azure App Service**.

---

## ✨ Features

- **Express 4 backend**: Built-in health check probes (`/api/health`) and dynamic server metrics endpoint (`/api/status`).
- **Interactive Cloud Dashboard**: Displays live Uptime, RAM usage, CPU core counts, Node runtime versions, and Azure environment tags.
- **Diagnostics Terminal Console**: Built-in log window to test health endpoints and view API responses in real-time.
- **CI/CD Ready**: Includes `.github/workflows/azure-deploy.yml` for automated GitHub Actions build and deploy pipeline.
- **Zero Config for Azure**: Uses standard `package.json` with `npm start` and `process.env.PORT` binding recognized out-of-the-box by Azure Oryx deployment engine.

---

## 💻 Local Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or 20 LTS)
- [Git](https://git-scm.com/)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Web Server
```bash
npm start
```
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🐙 Step-by-Step: Upload to GitHub

1. Open your terminal in this directory (`app service`).
2. Initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Azure App Service Ready App"
   ```
3. Create a new public or private repository on [GitHub](https://github.com/new).
4. Link your remote repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```

---

## ☁️ Step-by-Step: Deploy to Azure App Service

### Option A: Automated GitHub Actions CI/CD (Recommended)

1. **Create an Azure Web App**:
   - Go to [Azure Portal](https://portal.azure.com/).
   - Click **Create a resource** &gt; **Web App**.
   - Fill in:
     - **App name**: Choose a unique name (e.g., `my-azure-demo-app`).
     - **Runtime stack**: `Node 20 LTS` (or `Node 18 LTS`).
     - **Operating System**: `Linux` or `Windows`.
     - **Pricing Plan**: `Free F1` or `Basic B1`.
   - Click **Review + create** &gt; **Create**.

2. **Download Publish Profile**:
   - Once your Web App is created, open its resource page in Azure Portal.
   - Click **Download publish profile** from the top action bar. Save the downloaded `.PublishSettings` file.

3. **Add Secret to GitHub**:
   - Open your repository on GitHub.
   - Go to **Settings** &gt; **Secrets and variables** &gt; **Actions**.
   - Click **New repository secret**.
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Secret**: Paste the full XML content of the downloaded `.PublishSettings` file.
   - Click **Add secret**.

4. **Update Workflow File**:
   - Open `.github/workflows/azure-deploy.yml` in your editor.
   - Change `AZURE_WEBAPP_NAME` to your exact Azure Web App name:
     ```yaml
     env:
       AZURE_WEBAPP_NAME: 'my-azure-demo-app'
     ```
   - Commit and push to `main`:
     ```bash
     git add .github/workflows/azure-deploy.yml
     git commit -m "Configure Azure Web App name"
     git push
     ```

🎉 **Done!** GitHub Actions will automatically build your app and deploy it to Azure App Service. Your live app URL will be `https://YOUR_APP_NAME.azurewebsites.net`.

---

### Option B: Deploy Direct from Azure Portal (Deployment Center)

1. In Azure Portal, open your Web App.
2. Click **Deployment Center** in the left menu.
3. Select **GitHub** as the source and authorize your GitHub account.
4. Select your **Organization**, **Repository**, and **Branch** (`main`).
5. Click **Save**. Azure will automatically create and run the deployment workflow for you!

---

## 🔍 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Main Dashboard Web Interface |
| `/api/health` | `GET` | Health Check Ping (Returns status `Healthy` and HTTP 200) |
| `/api/status` | `GET` | Returns System Uptime, Memory usage, CPU cores, & Azure env vars |
| `/api/info` | `GET` | Node.js version and host deployment runtime info |

---

## 🛠 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── azure-deploy.yml    # Automated CI/CD workflow for Azure
├── public/
│   ├── index.html             # Dashboard UI layout
│   ├── style.css              # Glassmorphic dark styling & responsive grid
│   └── app.js                 # Dynamic metrics polling & console diagnostics
├── .gitignore                 # Excludes node_modules & temporary logs
├── package.json               # Node.js manifest & dependencies (Express)
├── server.js                  # Express Web Server & REST API endpoints
└── README.md                  # Project & deployment documentation
```
