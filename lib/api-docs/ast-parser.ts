import fs from 'fs';
import * as ts from 'typescript';

export interface RouteFunction {
  method: string;
  parameters: Parameter[];
  responseType?: string;
  summary?: string;
  description?: string;
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  location: 'query' | 'path' | 'body';
  description?: string;
}

export interface ParsedRoute {
  path: string;
  functions: RouteFunction[];
}

export class AstParser {
  private program: ts.Program;
  private checker: ts.TypeChecker;

  constructor() {
    // Create TypeScript program for type checking
    const configPath = ts.findConfigFile(
      process.cwd(),
      ts.sys.fileExists,
      'tsconfig.json',
    );
    const configFile = ts.readConfigFile(
      configPath || 'tsconfig.json',
      ts.sys.readFile,
    );
    const compilerOptions = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      process.cwd(),
    ).options;

    this.program = ts.createProgram([], compilerOptions);
    this.checker = this.program.getTypeChecker();
  }

  parseRouteFile(filePath: string, apiPath: string): ParsedRoute {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const functions: RouteFunction[] = [];

    // Visit all nodes in the AST
    const visit = (node: ts.Node) => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const functionName = node.name.text;

        // Check if it's an HTTP method function
        const httpMethods = [
          'GET',
          'POST',
          'PUT',
          'PATCH',
          'DELETE',
          'HEAD',
          'OPTIONS',
        ];
        if (httpMethods.includes(functionName)) {
          const routeFunction = this.parseRouteFunction(
            node,
            functionName,
            apiPath,
          );
          if (routeFunction) {
            functions.push(routeFunction);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return {
      path: apiPath,
      functions,
    };
  }

  private parseRouteFunction(
    node: ts.FunctionDeclaration,
    method: string,
    apiPath: string,
  ): RouteFunction | null {
    try {
      const parameters: Parameter[] = [];

      // Extract parameters from function signature
      if (node.parameters) {
        for (const param of node.parameters) {
          if (
            ts.isParameter(param) &&
            param.name &&
            ts.isIdentifier(param.name)
          ) {
            const paramName = param.name.text;

            // Check if it's NextRequest parameter
            if (paramName === 'request' && param.type) {
              const requestParams = this.extractRequestParameters(apiPath);
              parameters.push(...requestParams);
            }
          }
        }
      }

      // Extract JSDoc comments for summary and description
      const jsDoc = this.extractJsDocComments(node);

      return {
        method,
        parameters,
        summary: jsDoc.summary || this.generateDefaultSummary(method, apiPath),
        description:
          jsDoc.description || this.generateDefaultDescription(method, apiPath),
      };
    } catch (error) {
      console.error(`Error parsing route function ${method}:`, error);
      return null;
    }
  }

  private extractRequestParameters(apiPath: string): Parameter[] {
    const parameters: Parameter[] = [];

    // Extract path parameters from URL
    const pathParamRegex = /\{([^}]+)\}/g;
    let match;
    while ((match = pathParamRegex.exec(apiPath)) !== null) {
      parameters.push({
        name: match[1],
        type: 'string',
        required: true,
        location: 'path',
        description: `${match[1]} identifier`,
      });
    }

    // Add common query parameters based on route patterns
    if (apiPath.includes('/products')) {
      this.addProductQueryParameters(parameters);
    }

    return parameters;
  }

  private addProductQueryParameters(parameters: Parameter[]) {
    const queryParams = [
      { name: 'search', description: 'Search term for filtering' },
      { name: 'status', description: 'Filter by status' },
      { name: 'category', description: 'Filter by category' },
      { name: 'brand', description: 'Filter by brand ID' },
      { name: 'condition', description: 'Filter by condition' },
      { name: 'supplierId', description: 'Filter by supplier ID' },
      { name: 'warehouseId', description: 'Filter by warehouse ID' },
      { name: 'sortBy', description: 'Sort field and direction' },
      { name: 'page', description: 'Page number for pagination' },
      { name: 'limit', description: 'Items per page' },
    ];

    for (const param of queryParams) {
      parameters.push({
        name: param.name,
        type: 'string',
        required: false,
        location: 'query',
        description: param.description,
      });
    }
  }

  private extractJsDocComments(node: ts.Node): {
    summary?: string;
    description?: string;
  } {
    const result: { summary?: string; description?: string } = {};

    // Get JSDoc comments if they exist
    const jsDocTags = ts.getJSDocTags(node);
    for (const tag of jsDocTags) {
      if (tag.tagName.text === 'summary' && tag.comment) {
        result.summary =
          typeof tag.comment === 'string'
            ? tag.comment
            : tag.comment.map((c) => c.text).join('');
      }
      if (tag.tagName.text === 'description' && tag.comment) {
        result.description =
          typeof tag.comment === 'string'
            ? tag.comment
            : tag.comment.map((c) => c.text).join('');
      }
    }

    return result;
  }

  private generateDefaultSummary(method: string, apiPath: string): string {
    const resource = this.extractResourceName(apiPath);

    switch (method) {
      case 'GET':
        return apiPath.includes('{') ? `Get ${resource}` : `List ${resource}`;
      case 'POST':
        return `Create ${resource}`;
      case 'PUT':
        return `Update ${resource}`;
      case 'PATCH':
        return `Partially update ${resource}`;
      case 'DELETE':
        return `Delete ${resource}`;
      default:
        return `${method} ${resource}`;
    }
  }

  private generateDefaultDescription(method: string, apiPath: string): string {
    const resource = this.extractResourceName(apiPath);

    switch (method) {
      case 'GET':
        return apiPath.includes('{')
          ? `Retrieve a specific ${resource} by ID`
          : `Retrieve a list of ${resource} with optional filtering and pagination`;
      case 'POST':
        return `Create a new ${resource}`;
      case 'PUT':
        return `Update an existing ${resource}`;
      case 'PATCH':
        return `Partially update an existing ${resource}`;
      case 'DELETE':
        return `Delete an existing ${resource}`;
      default:
        return `Perform ${method} operation on ${resource}`;
    }
  }

  private extractResourceName(apiPath: string): string {
    // Extract resource name from API path
    // e.g., "/products" -> "product", "/products/{id}" -> "product"
    const segments = apiPath.split('/').filter((s) => s && !s.includes('{'));
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return 'resource';

    // Convert plural to singular (simple approach)
    if (lastSegment.endsWith('s') && lastSegment.length > 1) {
      return lastSegment.slice(0, -1);
    }

    return lastSegment;
  }
}
