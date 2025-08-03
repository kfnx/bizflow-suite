import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';

export interface OpenAPISchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  items?: OpenAPISchema;
  enum?: string[];
  format?: string;
  example?: any;
}

export interface SchemaDefinition {
  name: string;
  schema: OpenAPISchema;
}

export class SchemaExtractor {
  private schemaFilePath: string;

  constructor() {
    this.schemaFilePath = path.join(process.cwd(), 'lib/db/schema.ts');
  }

  extractSchemas(): Record<string, OpenAPISchema> {
    const schemas: Record<string, OpenAPISchema> = {};

    try {
      const content = fs.readFileSync(this.schemaFilePath, 'utf-8');
      const sourceFile = ts.createSourceFile(
        this.schemaFilePath,
        content,
        ts.ScriptTarget.Latest,
        true,
      );

      // Extract table definitions
      const tableSchemas = this.extractTableSchemas(sourceFile);
      Object.assign(schemas, tableSchemas);

      // Add common schemas
      Object.assign(schemas, this.getCommonSchemas());

      return schemas;
    } catch (error) {
      console.error('Error extracting schemas:', error);
      return this.getFallbackSchemas();
    }
  }

  private extractTableSchemas(
    sourceFile: ts.SourceFile,
  ): Record<string, OpenAPISchema> {
    const schemas: Record<string, OpenAPISchema> = {};

    const visit = (node: ts.Node) => {
      if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (
            ts.isVariableDeclaration(declaration) &&
            declaration.name &&
            ts.isIdentifier(declaration.name) &&
            declaration.initializer &&
            ts.isCallExpression(declaration.initializer)
          ) {
            const tableName = declaration.name.text;
            const schema = this.parseTableSchema(
              declaration.initializer,
              tableName,
            );

            if (schema) {
              // Convert table name to PascalCase for schema name
              const schemaName = this.toPascalCase(tableName);
              schemas[schemaName] = schema;
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return schemas;
  }

  private parseTableSchema(
    callExpression: ts.CallExpression,
    tableName: string,
  ): OpenAPISchema | null {
    try {
      // Check if this is a mysqlTable call
      if (
        !ts.isIdentifier(callExpression.expression) ||
        callExpression.expression.text !== 'mysqlTable'
      ) {
        return null;
      }

      const properties: Record<string, any> = {};
      const required: string[] = [];

      // Get the table definition object (second argument)
      if (callExpression.arguments.length >= 2) {
        const tableDefArg = callExpression.arguments[1];

        if (ts.isObjectLiteralExpression(tableDefArg)) {
          for (const property of tableDefArg.properties) {
            if (
              ts.isPropertyAssignment(property) &&
              ts.isIdentifier(property.name)
            ) {
              const fieldName = property.name.text;
              const fieldSchema = this.parseFieldDefinition(
                property.initializer,
              );

              if (fieldSchema) {
                properties[fieldName] = fieldSchema.schema;
                if (fieldSchema.required) {
                  required.push(fieldName);
                }
              }
            }
          }
        }
      }

      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
      };
    } catch (error) {
      console.error(`Error parsing table schema for ${tableName}:`, error);
      return null;
    }
  }

  private parseFieldDefinition(
    node: ts.Node,
  ): { schema: OpenAPISchema; required: boolean } | null {
    try {
      if (!ts.isCallExpression(node)) {
        return null;
      }

      const fieldType = this.getFieldType(node);
      const isRequired = this.isFieldRequired(node);

      return {
        schema: fieldType,
        required: isRequired,
      };
    } catch (error) {
      return null;
    }
  }

  private getFieldType(callExpression: ts.CallExpression): OpenAPISchema {
    if (!ts.isIdentifier(callExpression.expression)) {
      return { type: 'string' };
    }

    const typeName = callExpression.expression.text;

    switch (typeName) {
      case 'varchar':
      case 'text':
        return { type: 'string' };
      case 'int':
        return { type: 'integer', format: 'int32' };
      case 'decimal':
        return { type: 'number', format: 'decimal' };
      case 'boolean':
        return { type: 'boolean' };
      case 'date':
        return { type: 'string', format: 'date' };
      case 'timestamp':
        return { type: 'string', format: 'date-time' };
      case 'mysqlEnum':
        return this.parseEnumField(callExpression);
      default:
        return { type: 'string' };
    }
  }

  private parseEnumField(callExpression: ts.CallExpression): OpenAPISchema {
    // Try to extract enum values from the call expression
    if (callExpression.arguments.length >= 2) {
      const enumArg = callExpression.arguments[1];
      if (ts.isArrayLiteralExpression(enumArg)) {
        const enumValues = enumArg.elements
          .filter(ts.isStringLiteral)
          .map((el) => el.text);

        if (enumValues.length > 0) {
          return {
            type: 'string',
            enum: enumValues,
          };
        }
      }
    }

    return { type: 'string' };
  }

  private isFieldRequired(node: ts.Node): boolean {
    // Check if field has .notNull() call
    let current = node;
    while (ts.isCallExpression(current)) {
      if (
        ts.isPropertyAccessExpression(current.expression) &&
        ts.isIdentifier(current.expression.name) &&
        current.expression.name.text === 'notNull'
      ) {
        return true;
      }

      // Move to the parent expression
      if (ts.isPropertyAccessExpression(current.expression)) {
        current = current.expression.expression;
      } else {
        break;
      }
    }

    return false;
  }

  private getCommonSchemas(): Record<string, OpenAPISchema> {
    return {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['error'],
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
          total: { type: 'integer', minimum: 0 },
          totalPages: { type: 'integer', minimum: 0 },
        },
        required: ['page', 'limit', 'total', 'totalPages'],
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { type: 'object' },
          },
          pagination: { $ref: '#/components/schemas/Pagination' },
        },
        required: ['data', 'pagination'],
      },
    };
  }

  private getFallbackSchemas(): Record<string, OpenAPISchema> {
    return {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
          price: { type: 'number' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
        },
      },
      ...this.getCommonSchemas(),
    };
  }

  private toPascalCase(str: string): string {
    return (
      str.charAt(0).toUpperCase() +
      str.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    );
  }
}
