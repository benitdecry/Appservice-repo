// Client-side Script for Azure App Service Dashboard

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const envBadge = document.getElementById('env-badge');
    const envText = document.getElementById('env-text');

    const valUptime = document.getElementById('val-uptime');
    const valUptimeSub = document.getElementById('val-uptime-sub');
    const valPort = document.getElementById('val-port');

    const valMemory = document.getElementById('val-memory');
    const memoryBar = document.getElementById('memory-bar');
    const valHeap = document.getElementById('val-heap');

    const valCpus = document.getElementById('val-cpus');
    const valOs = document.getElementById('val-os');
    const valArch = document.getElementById('val-arch');
    const valNodeVer = document.getElementById('val-node-ver');

    const valSiteName = document.getElementById('val-site-name');
    const valAzureRegion = document.getElementById('val-azure-region');
    const valAzureTag = document.getElementById('val-azure-tag');
    const valInstance = document.getElementById('val-instance');

    const consoleOutput = document.getElementById('console-output');

    // Buttons
    const btnRefresh = document.getElementById('btn-refresh');
    const btnHealthCheck = document.getElementById('btn-health-check');
    const btnClearConsole = document.getElementById('btn-clear-console');

    // Helper: Log message to terminal console
    function logToConsole(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `[${time}] ${message}`;
        consoleOutput.appendChild(entry);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    // Format uptime seconds into clean string (e.g. 2m 14s)
    function formatUptime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    }

    // Fetch System & Azure Status API
    async function fetchStatus() {
        try {
            logToConsole('GET /api/status - Fetching server diagnostics...', 'info');
            const res = await fetch('/api/status');
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

            const data = await res.json();

            // Update App Header
            statusText.textContent = `Status: ${data.app.status}`;
            if (data.azure.isAzureAppService) {
                envText.textContent = 'Azure App Service';
                envBadge.style.borderColor = 'rgba(0, 188, 242, 0.5)';
            } else {
                envText.textContent = 'Local Node Engine';
            }

            // Update Metrics Cards
            valUptime.textContent = formatUptime(data.app.uptimeSeconds);
            valUptimeSub.textContent = `Environment: ${data.app.environment}`;

            valMemory.textContent = data.system.memoryUsagePercent;
            memoryBar.style.width = data.system.memoryUsagePercent;
            valHeap.textContent = `Heap Used: ${data.system.heapUsedMb}`;

            valCpus.textContent = `${data.system.cpus} Cores`;
            valOs.textContent = `OS: ${data.system.platform} (${data.system.hostname})`;
            valArch.textContent = data.system.arch;

            valSiteName.textContent = data.azure.siteName;
            valAzureRegion.textContent = `Region: ${data.azure.region}`;
            valInstance.textContent = `Instance: ${data.azure.instanceId}`;

            if (data.azure.isAzureAppService) {
                valAzureTag.textContent = 'Azure Live';
                valAzureTag.className = 'tag tag-success';
            } else {
                valAzureTag.textContent = 'Local Node';
                valAzureTag.className = 'tag tag-info';
            }

            logToConsole(`Metrics synced successfully. Server Memory: ${data.system.memoryUsagePercent}, Uptime: ${data.app.uptimeSeconds}s`, 'success');
        } catch (err) {
            logToConsole(`Error fetching status: ${err.message}`, 'error');
            statusText.textContent = 'Offline / Error';
            statusIndicator.style.background = 'rgba(239, 68, 68, 0.1)';
        }
    }

    // Fetch Health Endpoint
    async function testHealthCheck() {
        try {
            logToConsole('GET /api/health - Executing probe ping...', 'info');
            const res = await fetch('/api/health');
            const data = await res.json();

            if (res.ok) {
                logToConsole(`Health Check Passed! Status: ${data.status}, Uptime: ${data.uptime}s`, 'success');
            } else {
                logToConsole(`Health Check Failed: ${res.statusText}`, 'error');
            }
        } catch (err) {
            logToConsole(`Health Check Failed: ${err.message}`, 'error');
        }
    }

    // Fetch Additional Node Info
    async function fetchInfo() {
        try {
            const res = await fetch('/api/info');
            const data = await res.json();
            valNodeVer.textContent = `Node ${data.nodeVersion}`;
        } catch (err) {
            // silent fail fallback
        }
    }

    // Event Listeners
    btnRefresh.addEventListener('click', () => {
        fetchStatus();
        fetchInfo();
    });

    btnHealthCheck.addEventListener('click', () => {
        testHealthCheck();
    });

    btnClearConsole.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
        logToConsole('Console cleared.', 'info');
    });

    // Initial Load & Polling Interval (every 5 seconds)
    fetchStatus();
    fetchInfo();
    setInterval(fetchStatus, 5000);
});
