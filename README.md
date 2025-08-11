# Clean Node - Efficient Node Modules Cleanup Tool

A fast and efficient Node.js utility to find and delete `node_modules` directories, helping you free up disk space.

## ✨ Features

- **🚀 Asynchronous Operations**: Uses async/await for non-blocking file system operations
- **📊 Progress Tracking**: Real-time progress indication during scanning and deletion
- **💾 Memory Efficient**: Processes directories without storing everything in memory
- **🛡️ Safe Scanning**: Skips system directories and handles permission errors gracefully
- **📏 Size Reporting**: Shows approximate disk space freed after deletion
- **⚡ Performance Optimized**: Uses efficient filtering and directory traversal
- **🎯 Smart Filtering**: Automatically skips common system directories and hidden files

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/sarowarhosen03/clean-node.git
cd clean-node

# Make it executable
chmod +x index.js

# Run directly
./index.js
```

## 📖 Usage

### Basic Usage
```bash
# Scan and clean node_modules from your home directory
node index.js

# Scan from a specific directory
node index.js /path/to/your/projects

# Using npm scripts
npm start
```

### Examples
```bash
# Clean node_modules from your entire home directory
node index.js ~

# Clean from a specific project folder
node index.js ~/projects

# Test on a small directory first
npm run dev
```

## 🔧 Efficiency Improvements

### Before (Original Version)
- ❌ Synchronous file operations blocking the event loop
- ❌ Multiple chained `.filter()` calls
- ❌ Redundant path resolution
- ❌ No error handling for file operations
- ❌ Poor user experience with no progress indication
- ❌ Memory inefficient storage of all paths

### After (Improved Version)
- ✅ **Asynchronous Operations**: Non-blocking file system operations using `fs.promises`
- ✅ **Efficient Filtering**: Single-pass filtering with optimized patterns
- ✅ **Smart Directory Skipping**: Uses `Set` for O(1) lookups of directories to skip
- ✅ **Progress Indication**: Real-time progress updates during operations
- ✅ **Error Handling**: Graceful handling of permission errors and missing directories
- ✅ **Memory Optimization**: Processes directories without excessive memory usage
- ✅ **Performance Metrics**: Shows timing and disk space freed
- ✅ **Depth Limiting**: Prevents infinite recursion with max depth limit
- ✅ **Smart Node Modules Handling**: Stops scanning inside node_modules directories

## 📊 Performance Benefits

- **Faster Scanning**: Async operations allow other processes to run concurrently
- **Better UX**: Progress indicators and timing information
- **Reduced Memory Usage**: Streaming approach instead of storing all paths
- **Improved Reliability**: Better error handling and graceful degradation
- **Smart Filtering**: Efficiently skips irrelevant directories
- **Node Modules Optimization**: Stops scanning inside node_modules directories to avoid unnecessary work

## 🛡️ Safety Features

- **Confirmation Prompt**: Always asks before deleting
- **System Directory Protection**: Automatically skips important system directories
- **Permission Handling**: Gracefully handles permission errors
- **Graceful Interruption**: Handles Ctrl+C gracefully
- **Error Recovery**: Continues operation even if some directories fail

## 📝 Output Example

```
Scanning for node_modules directories starting from: /home/user
This may take a while for large directory trees...

Scan completed in 1250ms
Found 15 node_modules directories

Directories to be deleted:
1. /home/user/project1/node_modules
2. /home/user/project2/node_modules
3. /home/user/old-project/node_modules
...

Do you want to delete these node_modules directories? (y/n): y

Starting deletion process...
Deleting 15/15: old-project/node_modules

✅ Successfully deleted 15 node_modules directories
📦 Freed approximately 2.34 GB of disk space
⏱️  Deletion completed in 3200ms
```

## 🔧 Development

```bash
# Run tests
npm test

# Development mode (test on specific directory)
npm run dev
```

## 📋 Requirements

- Node.js >= 14.0.0
- File system read/write permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This tool permanently deletes `node_modules` directories. Make sure you have backups or can regenerate your dependencies before using this tool.
