/**
 * Check what routes are available on the server
 */

const http = require('http');

const routes = [
    '/hud',
 
    '/demo/command-center',
    '/demo/witty-galaxy-hud'
];

async function checkRoute(route) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5174,
            path: route,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const hasGalaxy = data.includes('🌌 Galaxy');
                const hasChanges = data.includes('galaxy-stats') || data.includes('political-parties');
                resolve({
                    route,
                    status: res.statusCode,
                    hasGalaxy,
                    hasChanges,
                    length: data.length
                });
            });
        });

        req.on('error', (e) => {
            resolve({ route, error: e.message });
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ route, error: 'timeout' });
        });

        req.end();
    });
}

async function checkAllRoutes() {
    console.log('🔍 Checking available routes on port 5174...\n');
    
    for (const route of routes) {
        const result = await checkRoute(route);
        
        if (result.error) {
            console.log(`❌ ${route}: ${result.error}`);
        } else {
            const status = result.status === 200 ? '✅' : '⚠️';
            const changes = result.hasChanges ? '✅ HAS CHANGES' : '❌ NO CHANGES';
            console.log(`${status} ${route} (${result.status}) - ${changes} - ${result.length} bytes`);
        }
    }
}

checkAllRoutes();
