
import fs from 'fs';
const content = fs.readFileSync('.env', 'utf8');
console.log('--- Start of .env ---');
console.log(content);
console.log('--- End of .env ---');

const apiKeyLine = content.split('\n').find(line => line.startsWith('VITE_FIREBASE_API_KEY'));
if (apiKeyLine) {
    const value = apiKeyLine.split('=')[1];
    console.log(`API Key value: "${value}"`);
    console.log('Character codes:');
    for (let i = 0; i < value.length; i++) {
        console.log(`${value[i]}: ${value.charCodeAt(i)}`);
    }
} else {
    console.log('API KEY not found');
}
