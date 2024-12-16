const fs = require('fs');
const path = require('path');

const readConfig = () => {
    const configPath = path.join(__dirname, '../config/bmz.conf');
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        const config = {};
        content.split('\n').forEach(line => {
            const match = line.match(/(.*) = (.*)/);
            if (match) {
                config[match[1].trim()] = match[2].trim();
            }
        });
        return config;
    }
    return {};
};

module.exports = { readConfig };
