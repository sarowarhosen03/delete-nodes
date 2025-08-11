#!/usr/bin/env node
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const readline = require('readline');

// Directories to skip (common system directories)
const SKIP_DIRS = new Set([
    'Desktop', 'Documents', 'Downloads', 'Music', 
    'Pictures', 'Public', 'Templates', 'Videos'
]);

// Directories to ignore (hidden and system)
const IGNORE_PATTERNS = [
    /^\./, // Hidden files/directories
    // /^node_modules$/, // Already found node_modules
    /^\.git$/, // Git directory
    /^\.vscode$/, // VS Code settings
    /^\.idea$/, // IntelliJ settings
];

async function scanDirectory(dirPath, depth = 0) {
    const nodeModulesPaths = [];
    const maxDepth = 10; // Prevent infinite recursion
    
    // Don't scan inside node_modules directories
    if (path.basename(dirPath) === 'node_modules') {
        return nodeModulesPaths;
    }
    
    if (depth > maxDepth) {
        return nodeModulesPaths;
    }

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            // Skip if it matches ignore patterns
            if (IGNORE_PATTERNS.some(pattern => pattern.test(entry.name))) {
                continue;
            }
            
            // Skip common system directories
            if (SKIP_DIRS.has(entry.name)) {
                continue;
            }
            
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules') {
                    // Found a node_modules directory - add it and don't scan inside it
                    nodeModulesPaths.push(fullPath);
                } else {
                    // Recursively scan subdirectories (but not inside node_modules)
                    const subPaths = await scanDirectory(fullPath, depth + 1);
                    nodeModulesPaths.push(...subPaths);
                }
            }
        }
    } catch (error) {
        // Silently skip directories we can't access
        if (error.code !== 'EACCES' && error.code !== 'ENOENT') {
            console.warn(`Warning: Could not scan ${dirPath}: ${error.message}`);
        }
    }
    
    return nodeModulesPaths;
}

async function deleteNodeModules(paths) {
    let deletedCount = 0;
    let totalSize = 0;
    
    console.log('\nStarting deletion process...');
    
    for (let i = 0; i < paths.length; i++) {
        const nodeModulesPath = paths[i];
        
        try {
            // Show progress
            process.stdout.write(`\rDeleting ${i + 1}/${paths.length}: ${path.basename(path.dirname(nodeModulesPath))}/node_modules`);
            
            // Get directory size before deletion (optional)
            try {
                const stats = await fs.stat(nodeModulesPath);
                totalSize += stats.size;
            } catch (error) {
                // Ignore size calculation errors
            }
            
            await fs.rm(nodeModulesPath, { recursive: true, force: true });
            deletedCount++;
            
        } catch (error) {
            console.warn(`\nWarning: Could not delete ${nodeModulesPath}: ${error.message}`);
        }
    }
    
    console.log('\n'); // Clear progress line
    return { deletedCount, totalSize };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
    const startTime = Date.now();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    let startDir = os.homedir();
    let autoConfirm = false;
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-y' || arg === '--yes') {
            autoConfirm = true;
        } else if (!arg.startsWith('-')) {
            startDir = arg;
        }
    }
    
    console.log(`Scanning for node_modules directories starting from: ${startDir}`);
    if (autoConfirm) {
        console.log('⚠️  Auto-confirmation enabled (-y flag)');
    }
    console.log('This may take a while for large directory trees...\n');
    
    try {
        // Scan for node_modules directories
        const nodeModulesPaths = await scanDirectory(startDir);
        
        const scanTime = Date.now() - startTime;
        console.log(`\nScan completed in ${scanTime}ms`);
        console.log(`Found ${nodeModulesPaths.length} node_modules directories`);
        
        if (nodeModulesPaths.length === 0) {
            console.log('No node_modules directories found.');
            return;
        }
        
        // Show what will be deleted
        console.log('\nDirectories to be deleted:');
        nodeModulesPaths.forEach((p, i) => {
            console.log(`${i + 1}. ${p}`);
        });
        
        let shouldDelete = false;
        
        if (autoConfirm) {
            console.log('\n✅ Auto-confirming deletion (use without -y flag for manual confirmation)');
            shouldDelete = true;
        } else {
            // Ask for confirmation
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            const answer = await new Promise((resolve) => {
                rl.question('\nDo you want to delete these node_modules directories? (y/n): ', resolve);
            });
            
            rl.close();
            shouldDelete = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
        }
        
        if (shouldDelete) {
            const deleteStartTime = Date.now();
            const { deletedCount, totalSize } = await deleteNodeModules(nodeModulesPaths);
            const deleteTime = Date.now() - deleteStartTime;
            
            console.log(`\n✅ Successfully deleted ${deletedCount} node_modules directories`);
            if (totalSize > 0) {
                console.log(`📦 Freed approximately ${formatBytes(totalSize)} of disk space`);
            }
            console.log(`⏱️  Deletion completed in ${deleteTime}ms`);
        } else {
            console.log('❌ Operation cancelled.');
        }
        
    } catch (error) {
        console.error('❌ An error occurred:', error.message);
        process.exit(1);
    }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Operation interrupted by user');
    process.exit(0);
});

// Run the main function
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
}
