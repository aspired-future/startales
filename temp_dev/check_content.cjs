/**
 * Check what content is actually being served
 */

const http = require('http');

function checkContent() {
    const options = {
        hostname: 'localhost',
        port: 5174,
        path: '/demo/command-center',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('📄 CONTENT FROM /demo/command-center:\n');
            console.log('Status:', res.statusCode);
            console.log('Headers:', res.headers);
            console.log('Content Length:', data.length);
            console.log('\n--- CONTENT ---');
            console.log(data.substring(0, 1000)); // First 1000 chars
            console.log('\n--- END CONTENT ---');
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e.message);
    });

    req.end();
}

checkContent();
