const fs = require('fs');
const path = require('path');

function findJsonFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            results = results.concat(findJsonFiles(fullPath));
        } else if (item.endsWith('-result.json')) {
            results.push(fullPath);
        }
    });
    
    return results;
}

const resultsDir = path.join(process.cwd(), 'allure-results');

if (!fs.existsSync(resultsDir)) {
    console.log('allure-results not found');
    process.exit(1);
}

const files = findJsonFiles(resultsDir);

if (files.length === 0) {
    console.log('*-result.json not found');
    process.exit(0);
}

let stats = {
    processed: 0,
    removed: 0,
    errors: 0
};

const delete_labels = [
    'language',
    'package',
    'thread',
    'subSuite',
    'framework',
    'host',
    'parentSuite',
    'titlePath'
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(content);
        
        if (data.labels && Array.isArray(data.labels)) {
            const beforeCount = data.labels.length;
            data.labels = data.labels.filter(label => !delete_labels.includes(label.name));
            const afterCount = data.labels.length;
            
            if (beforeCount !== afterCount) {
                fs.writeFileSync(file, JSON.stringify(data, null, 2));
                stats.processed++;
                stats.removed += (beforeCount - afterCount);
            }
        }
    } catch (err) {
        stats.errors++;
        console.log(`${path.relative(process.cwd(), file)}`);
        console.log(`Error: ${err.message}\n`);
    }
});