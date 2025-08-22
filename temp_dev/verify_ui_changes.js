/**
 * Simple verification script to check if UI changes are visible
 */

const http = require('http');

function checkUIChanges() {
    console.log('🔍 Verifying UI Reorganization Changes...\n');
    
    const options = {
        hostname: 'localhost',
        port: 5174,
        path: '/demo/command-center',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('✅ Successfully connected to server on port 5174\n');
            
            // Check for completed changes
            const changes = [
                { name: 'Galaxy Menu Section', search: '🌌 Galaxy', found: data.includes('🌌 Galaxy') },
                { name: 'Statistics in Galaxy', search: 'galaxy-stats', found: data.includes('galaxy-stats') },
                { name: 'Political Parties (not Politics)', search: 'political-parties', found: data.includes('political-parties') },
                { name: 'Science & Tech (not Science)', search: '🔬 Science & Tech', found: data.includes('🔬 Science & Tech') },
                { name: 'WhoseApp in Communications', search: 'whoseapp', found: data.includes('whoseapp') },
                { name: 'Planets & Cities (not Cities)', search: 'planets-cities', found: data.includes('planets-cities') },
                { name: 'Visuals in Galaxy Menu', search: 'data-system="visuals"', found: data.includes('data-system="visuals"') }
            ];

            console.log('📋 VERIFICATION RESULTS:\n');
            
            let passedCount = 0;
            changes.forEach(change => {
                const status = change.found ? '✅ FOUND' : '❌ MISSING';
                console.log(`${status} ${change.name}`);
                if (change.found) passedCount++;
            });

            console.log(`\n📊 SUMMARY: ${passedCount}/${changes.length} changes verified`);
            
            if (passedCount === changes.length) {
                console.log('🎉 All UI reorganization changes are visible!');
            } else {
                console.log('⚠️  Some changes may not be visible yet. Server might need restart.');
            }

            // Show sample of the HTML to verify structure
            console.log('\n🔍 SAMPLE HTML STRUCTURE:');
            const galaxySection = data.match(/🌌 Galaxy[\s\S]*?<\/div>/);
            if (galaxySection) {
                console.log('Found Galaxy section in HTML ✅');
            } else {
                console.log('Galaxy section not found in HTML ❌');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Error connecting to server: ${e.message}`);
        console.log('Make sure the server is running on port 5174');
    });

    req.end();
}

checkUIChanges();
