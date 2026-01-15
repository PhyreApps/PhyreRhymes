const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { app } = require('electron');

const execAsync = promisify(exec);

class RhymeCLIHandler {
    /**
     * Get the path to the Go CLI executable
     */
    static getCLIPath() {
        // Add .exe extension on Windows
        const executableName = process.platform === 'win32' ? 'rhyme-cli.exe' : 'rhyme-cli';
        
        // Get the app path (works in both dev and production)
        const appPath = app.getAppPath();
        const isDev = !app.isPackaged;
        
        // In development, app.getAppPath() might return .webpack path
        // We need to go up to the actual project root
        let projectRoot = appPath;
        if (isDev && appPath.includes('.webpack')) {
            // Go up from .webpack/main/native_modules to project root
            projectRoot = path.resolve(appPath, '..', '..', '..', '..');
        } else if (isDev) {
            // Already at project root
            projectRoot = appPath;
        }
        
        // Try multiple possible paths
        const possiblePaths = [
            // Development: in project root
            path.join(projectRoot, 'rhyme-cli', executableName),
            // Development: absolute path
            path.resolve(projectRoot, 'rhyme-cli', executableName),
            // Fallback: relative to main.js location (if __dirname is available)
            path.join(__dirname, '..', '..', 'rhyme-cli', executableName),
            // Production: in resources folder
            process.resourcesPath ? path.join(process.resourcesPath, 'rhyme-cli', executableName) : null,
        ].filter(p => p !== null);

        // Find the first existing path
        for (const cliPath of possiblePaths) {
            try {
                if (fs.existsSync(cliPath)) {
                    // Make sure it's executable
                    if (process.platform !== 'win32') {
                        try {
                            fs.chmodSync(cliPath, 0o755);
                        } catch (e) {
                            // Ignore chmod errors
                        }
                    }
                    console.log('Found CLI at:', cliPath);
                    return cliPath;
                }
            } catch (e) {
                // Continue to next path
            }
        }

        // Log error with all tried paths
        console.error('CLI not found. Tried paths:', possiblePaths);
        console.error('App path:', appPath);
        console.error('Project root:', projectRoot);
        
        // Return the first path as default (will show error if not found)
        return possiblePaths[0];
    }

    /**
     * Find rhyming words using Go CLI
     */
    static async findRhymes(word, maxResults = 100) {
        if (!word || word.trim() === '') {
            return { success: false, error: 'Empty word' };
        }

        const cliPath = this.getCLIPath();
        const escapedWord = word.replace(/"/g, '\\"');
        const command = `"${cliPath}" rhyme "${escapedWord}" --max ${maxResults}`;

        try {
            const cliDir = path.dirname(cliPath);
            const { stdout, stderr } = await execAsync(command, {
                cwd: cliDir,
                maxBuffer: 10 * 1024 * 1024, // 10MB buffer
            });

            if (stderr) {
                console.error('CLI stderr:', stderr);
            }

            return JSON.parse(stdout);
        } catch (error) {
            console.error('Error executing CLI:', error);
            return {
                success: false,
                error: error.message || 'Failed to execute CLI'
            };
        }
    }

    /**
     * Get word stress information
     */
    static async getStress(word) {
        if (!word || word.trim() === '') {
            return null;
        }

        const cliPath = this.getCLIPath();
        const escapedWord = word.replace(/"/g, '\\"');
        const command = `"${cliPath}" stress "${escapedWord}"`;

        try {
            const cliDir = path.dirname(cliPath);
            const { stdout, stderr } = await execAsync(command, {
                cwd: cliDir,
            });

            if (stderr) {
                console.error('CLI stderr:', stderr);
            }

            return JSON.parse(stdout);
        } catch (error) {
            console.error('Error getting stress:', error);
            return null;
        }
    }
}

module.exports = RhymeCLIHandler;
