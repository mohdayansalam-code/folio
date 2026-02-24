const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname);

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    // Remove existing dark mode text overrides as our tokens handle it natively
    newContent = newContent.replace(/\bdark:text-white\b/g, '');
    newContent = newContent.replace(/\bdark:text-n-[1-7]\b/g, '');
    newContent = newContent.replace(/\bdark:text-black\b/g, '');

    // Map `text-n-1` and `text-black` to `text-primary`
    newContent = newContent.replace(/\btext-n-1\b/g, 'text-primary');
    newContent = newContent.replace(/\btext-black\b/g, 'text-primary');

    // Map `text-n-2` to `text-secondary`
    newContent = newContent.replace(/\btext-n-2\b/g, 'text-secondary');

    // Map `text-n-3` and `text-n-4` to `text-muted` (when used as text color)
    newContent = newContent.replace(/\btext-n-3\b/g, 'text-muted');
    newContent = newContent.replace(/\btext-n-4\b/g, 'text-muted');

    // Clean up multiple spaces resulting from deletions
    newContent = newContent.replace(/\s{2,}/g, (match) => {
        // Only replace horizontal spaces in classNames
        if (match.includes('\n')) return match;
        return ' ';
    });

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                walkDir(fullPath);
            }
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                replaceInFile(fullPath);
            }
        }
    }
}

walkDir(directoryPath);
console.log("Typography replacement complete.");
