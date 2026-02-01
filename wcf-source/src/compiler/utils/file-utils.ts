import fs from 'fs';

export const safeReadFile = async (filePath: string): Promise<string | null> => {
  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
};

export const collectFilesRecursively = async (dir: string, filter: (fileName: string) => boolean): Promise<string[]> => {
  const files: string[] = [];

  const collect = async (currentDir: string): Promise<void> => {
    try {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = `${currentDir}/${entry.name}`;
        if (entry.isDirectory()) {
          await collect(fullPath);
        } else if (entry.isFile() && filter(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Skip directories that don't exist or can't be read
    }
  };

  await collect(dir);
  return files;
};

export const directoryExists = (dir: string): boolean => {
  try {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
};

export const toCamelCase = (str: string): string => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export const getContentType = (url: string): string => {
  const ext = url.substring(url.lastIndexOf('.'));
  switch (ext) {
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.html':
      return 'text/html';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'text/plain';
  }
};
