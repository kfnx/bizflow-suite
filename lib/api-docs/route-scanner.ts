import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

export interface RouteInfo {
  path: string;
  filePath: string;
  httpMethods: string[];
  relativePath: string;
}

export class RouteScanner {
  private appDir: string;

  constructor(appDir = 'app') {
    this.appDir = path.join(process.cwd(), appDir);
  }

  async scanRoutes(): Promise<RouteInfo[]> {
    try {
      // Find all route.ts files in the app/api directory
      const routeFiles = await glob('api/**/route.ts', {
        cwd: this.appDir,
        absolute: true,
      });

      const routes: RouteInfo[] = [];

      for (const filePath of routeFiles) {
        const routeInfo = await this.analyzeRouteFile(filePath);
        if (routeInfo) {
          routes.push(routeInfo);
        }
      }

      return routes.sort((a, b) => a.path.localeCompare(b.path));
    } catch (error) {
      console.error('Error scanning routes:', error);
      return [];
    }
  }

  private async analyzeRouteFile(filePath: string): Promise<RouteInfo | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract API path from file path
      const relativePath = path.relative(this.appDir, filePath);
      const apiPath = this.filePathToApiPath(relativePath);

      // Extract HTTP methods from exported functions
      const httpMethods = this.extractHttpMethods(content);

      if (httpMethods.length === 0) {
        return null;
      }

      return {
        path: apiPath,
        filePath,
        httpMethods,
        relativePath,
      };
    } catch (error) {
      console.error(`Error analyzing route file ${filePath}:`, error);
      return null;
    }
  }

  private filePathToApiPath(relativePath: string): string {
    // Convert file path to API path
    // e.g., "api/products/route.ts" -> "/products"
    // e.g., "api/products/[id]/route.ts" -> "/products/{id}"
    
    let apiPath = relativePath
      .replace(/^api\//, '') // Remove "api/" prefix
      .replace(/\/route\.ts$/, '') // Remove "/route.ts" suffix
      .replace(/\[([^\]]+)\]/g, '{$1}'); // Convert [id] to {id}

    // Handle root API path
    if (!apiPath) {
      return '/';
    }

    return `/${apiPath}`;
  }

  private extractHttpMethods(content: string): string[] {
    const methods: string[] = [];
    const httpMethodRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*\(/g;
    
    let match;
    while ((match = httpMethodRegex.exec(content)) !== null) {
      methods.push(match[1]);
    }

    return methods;
  }

  async getRouteContent(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }
}