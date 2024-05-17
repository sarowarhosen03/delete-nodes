#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

function scanDir(prevPath = os.homedir()) {
    const targetDir = path.resolve(prevPath);
    fs.readdirSync(targetDir).filter(dir => !dir.startsWith(".")).filter(dir => !dir.startsWith("Desktop")).filter(dir => !dir.startsWith("Documents")).filter(dir => !dir.startsWith("Downloads")).filter(dir => !dir.startsWith("Music")).filter(dir => !dir.startsWith("Pictures")).filter(dir => !dir.startsWith("Public")).filter(dir => !dir.startsWith("Templates")).filter(dir => {
        try {
            return fs.statSync(`${targetDir}/${dir}`).isDirectory();
        } catch (error) {
            return false;
        }
    }).forEach(dir => {
        // console.log(dir);
        mapdir(dir, `${targetDir}/${dir}`);
    })

}

const toDelete = []
function mapdir(dirname, prevPath) {
    // console.log(dirname, prevPath);
    if (dirname !== 'node_modules') {
        scanDir(prevPath);
    } else {
        const dletePath = path.resolve(prevPath);
        toDelete.push(dletePath);

    }

}
scanDir();


//ask confirmation y/n form user using nodejs readline

const size = toDelete.length;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(...toDelete);
console.log('Scanning for node_modules directories...');

if (size > 0) {
    console.log(`Found ${size} modules to delete.`);

    rl.question('Do you want to delete the modules? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            // Delete the modules
            toDelete.forEach((filePath) => {
                fs.rmSync(filePath, { recursive: true });
            });
            console.log(`Deleted ${size} modules.`);
        } else {
            console.log('Aborted.');
        }

        rl.close();
    });
} else {
    console.log('No node_modules found.');
    rl.close();
}
