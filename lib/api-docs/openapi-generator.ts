import { AstParser, ParsedRoute, RouteFunction } from './ast-parser';
import { RouteInfo, RouteScanner } from './route-scanner';
import { OpenAPISchema, SchemaExtractor } from './schema-extractor';

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, OpenAPISchema>;
  };
}

export class OpenAPIGenerator {
  private routeScanner: RouteScanner;
  private astParser: AstParser;
  private schemaExtractor: SchemaExtractor;

  constructor() {
    this.routeScanner = new RouteScanner();
    this.astParser = new AstParser();
    this.schemaExtractor = new SchemaExtractor();
  }

  async generateSpec(): Promise<OpenAPISpec> {
    try {
      // Scan all routes
      const routes = await this.routeScanner.scanRoutes();

      // Parse each route file
      const parsedRoutes: ParsedRoute[] = [];
      for (const route of routes) {
        const parsed = this.astParser.parseRouteFile(
          route.filePath,
          route.path,
        );
        parsedRoutes.push(parsed);
      }

      // Extract schemas from Drizzle definitions
      const schemas = this.schemaExtractor.extractSchemas();

      // Generate OpenAPI spec
      const spec: OpenAPISpec = {
        openapi: '3.0.3',
        info: {
          title: 'BizDocGen API',
          description:
            'Auto-generated API documentation for business document generation and management system',
          version: '1.0.0',
        },
        servers: [
          {
            url: '/api',
            description: 'API server',
          },
        ],
        paths: this.generatePaths(parsedRoutes),
        components: {
          schemas,
        },
      };

      return spec;
    } catch (error) {
      console.error('Error generating OpenAPI spec:', error);
      throw error;
    }
  }

  private generatePaths(routes: ParsedRoute[]): Record<string, any> {
    const paths: Record<string, any> = {};

    for (const route of routes) {
      const pathItem: Record<string, any> = {};

      for (const func of route.functions) {
        const operation = this.generateOperation(func, route.path);
        pathItem[func.method.toLowerCase()] = operation;
      }

      if (Object.keys(pathItem).length > 0) {
        paths[route.path] = pathItem;
      }
    }

    return paths;
  }

  private generateOperation(func: RouteFunction, path: string): any {
    const operation: any = {
      summary: func.summary,
      description: func.description,
      parameters: this.generateParameters(func),
      responses: this.generateResponses(func, path),
    };

    // Add request body for POST, PUT, PATCH methods
    if (['POST', 'PUT', 'PATCH'].includes(func.method)) {
      operation.requestBody = this.generateRequestBody(path);
    }

    // Add tags based on path
    const tag = this.extractTagFromPath(path);
    if (tag) {
      operation.tags = [tag];
    }

    return operation;
  }

  private generateParameters(func: RouteFunction): any[] {
    const parameters: any[] = [];

    for (const param of func.parameters) {
      parameters.push({
        name: param.name,
        in: param.location,
        required: param.required,
        description: param.description,
        schema: {
          type: param.type,
        },
      });
    }

    return parameters;
  }

  private generateResponses(
    func: RouteFunction,
    path: string,
  ): Record<string, any> {
    const responses: Record<string, any> = {
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    };

    // Generate success response based on method and path
    const successResponse = this.generateSuccessResponse(func.method, path);
    responses['200'] = successResponse;

    // Add specific responses for certain methods
    if (func.method === 'POST') {
      responses['201'] = {
        description: 'Created successfully',
        content: {
          'application/json': {
            schema: successResponse.content['application/json'].schema,
          },
        },
      };
    }

    if (func.method === 'DELETE') {
      responses['204'] = {
        description: 'Deleted successfully',
      };
    }

    return responses;
  }

  private generateSuccessResponse(method: string, path: string): any {
    const resourceName = this.extractResourceFromPath(path);
    const schemaName = this.toPascalCase(resourceName);

    if (method === 'GET' && !path.includes('{')) {
      // List endpoint - return paginated response
      return {
        description: `List of ${resourceName}`,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: `#/components/schemas/${schemaName}`,
                  },
                },
                pagination: {
                  $ref: '#/components/schemas/Pagination',
                },
              },
            },
          },
        },
      };
    } else if (method === 'GET' && path.includes('{')) {
      // Get by ID endpoint
      return {
        description: `${schemaName} details`,
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${schemaName}`,
            },
          },
        },
      };
    } else {
      // POST, PUT, PATCH - return the created/updated resource
      return {
        description: `${schemaName} details`,
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${schemaName}`,
            },
          },
        },
      };
    }
  }

  private generateRequestBody(path: string): any {
    const resourceName = this.extractResourceFromPath(path);
    const schemaName = this.toPascalCase(resourceName);

    return {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${schemaName}`,
          },
        },
      },
    };
  }

  private extractTagFromPath(path: string): string | null {
    // Extract the first path segment as tag
    const segments = path.split('/').filter((s) => s && !s.includes('{'));
    return segments.length > 0 ? this.toPascalCase(segments[0]) : null;
  }

  private extractResourceFromPath(path: string): string {
    // Extract resource name from path
    const segments = path.split('/').filter((s) => s && !s.includes('{'));
    const resourceSegment =
      segments[segments.length - 1] || segments[0] || 'resource';

    // Convert plural to singular
    if (resourceSegment.endsWith('s') && resourceSegment.length > 1) {
      return resourceSegment.slice(0, -1);
    }

    return resourceSegment;
  }

  private toPascalCase(str: string): string {
    return (
      str.charAt(0).toUpperCase() +
      str.slice(1).replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase())
    );
  }
}
