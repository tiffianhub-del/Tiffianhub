/**
 * Quick script to check your current public IP address
 * This IP needs to be whitelisted in MongoDB Atlas Network Access
 */

const https = require('https');

console.log('🔍 Checking your current public IP address...\n');

const services = [
  { name: 'whatismyipaddress.com', url: 'https://api.ipify.org?format=json' },
  { name: 'ipify.org', url: 'https://api.ipify.org?format=json' },
  { name: 'ifconfig.me', url: 'https://ifconfig.me/ip' }
];

let completed = 0;

services.forEach((service, index) => {
  const req = https.get(service.url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        let ip;
        if (data.includes('{')) {
          const json = JSON.parse(data);
          ip = json.ip;
        } else {
          ip = data.trim();
        }
        
        if (ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
          console.log(`✅ ${service.name}: ${ip}`);
          if (index === 0) {
            console.log(`\n📍 Your IP address is: ${ip}`);
            console.log(`\n📋 Next steps:`);
            console.log(`   1. Go to https://cloud.mongodb.com`);
            console.log(`   2. Navigate to: Network Access`);
            console.log(`   3. Click "Add IP Address"`);
            console.log(`   4. Enter: ${ip}`);
            console.log(`   5. Click "Confirm"`);
            console.log(`   6. Wait 1-2 minutes, then restart your server\n`);
            process.exit(0);
          }
        }
      } catch (e) {
        console.log(`❌ ${service.name}: Failed to parse response`);
      }
      completed++;
    });
  });
  
  req.on('error', (err) => {
    console.log(`❌ ${service.name}: ${err.message}`);
    completed++;
    
    if (completed === services.length) {
      console.log('\n❌ Could not determine IP address automatically.');
      console.log('Please visit https://whatismyipaddress.com to find your IP manually.');
      process.exit(1);
    }
  });
  
  req.setTimeout(5000, () => {
    req.destroy();
    console.log(`⏱️  ${service.name}: Request timeout`);
    completed++;
    
    if (completed === services.length) {
      console.log('\n❌ Could not determine IP address automatically.');
      console.log('Please visit https://whatismyipaddress.com to find your IP manually.');
      process.exit(1);
    }
  });
});
