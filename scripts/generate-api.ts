#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

// Get command line arguments
const args = process.argv.slice(2);
const apiName = args[0];

if (!apiName) {
    console.error('Usage: ts-node src/common/scripts/generate-api.ts <api-name>');
    console.error('Example: ts-node src/common/scripts/generate-api.ts users');
    process.exit(1);
}

// Convert kebab-case to PascalCase
function toPascalCase(str: string): string {
    return str.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
}

// Convert kebab-case to camelCase
function toCamelCase(str: string): string {
    const pascalCase = toPascalCase(str);
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

// Extract the last part of the path for naming
const apiNameParts = apiName.split('/');
const lastPart = apiNameParts[apiNameParts.length - 1];

const pascalCaseName = toPascalCase(lastPart);
const camelCaseName = toCamelCase(lastPart);

// Calculate the correct relative path to common/decorators
const depth = apiNameParts.length;
const commonPath = '../'.repeat(depth + 1) + 'common/decorators';

// Create directory structure
const apiDir = path.join(process.cwd(), 'src', 'api', apiName);
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Controller template
const controllerTemplate = `import { Controller, Route, Get, Post, Put, Delete, Body, Path, Query } from 'tsoa';
import { ValidateBody } from '${commonPath}';
import Joi from 'joi';
import ${pascalCaseName}Service from './${lastPart}.service';

@Route('${apiName}')
export class ${pascalCaseName}Controller extends Controller {
    private readonly ${camelCaseName}Service: ${pascalCaseName}Service;

    constructor() {
        super();
        this.${camelCaseName}Service = new ${pascalCaseName}Service();
    }

    @Get()
    public async getAll${pascalCaseName}s(
        @Query() limit?: number,
        @Query() offset?: number,
    ): Promise<void> {
        return;
    }

    @Get('{id}')
    public async get${pascalCaseName}ById(
        @Path() id: string,
    ): Promise<void> {
        return;
    }

    @Post()
    @ValidateBody(Joi.object({
        // Add your validation schema here
        name: Joi.string().required(),
    }))
    public async create${pascalCaseName}(
        @Body() requestBody: any,
    ): Promise<void> {
        return;
    }

    @Put('{id}')
    @ValidateBody(Joi.object({
        // Add your validation schema here
        name: Joi.string().optional(),
    }))
    public async update${pascalCaseName}(
        @Path() id: string,
        @Body() requestBody: any,
    ): Promise<void> {
        return;
    }

    @Delete('{id}')
    public async delete${pascalCaseName}(
        @Path() id: string,
    ): Promise<void> {
        return;
    }
}`;

// Model template
const modelTemplate = `// Request/Response interfaces for ${pascalCaseName} API
`;

// Service template
const serviceTemplate = `
class ${pascalCaseName}Service {
    constructor() {
        // Initialize any dependencies here
    }
}

export default ${pascalCaseName}Service;`;

// Write files
const controllerPath = path.join(apiDir, `${lastPart}.controller.ts`);
const modelPath = path.join(apiDir, `${lastPart}.model.ts`);
const servicePath = path.join(apiDir, `${lastPart}.service.ts`);

fs.writeFileSync(controllerPath, controllerTemplate);
fs.writeFileSync(modelPath, modelTemplate);
fs.writeFileSync(servicePath, serviceTemplate);

console.log(`✅ Generated API files for '${apiName}':`);
console.log(`   📁 ${apiDir}/`);
console.log(`   📄 ${lastPart}.controller.ts`);
console.log(`   📄 ${lastPart}.model.ts`);
console.log(`   📄 ${lastPart}.service.ts`);
console.log('');
console.log('Next steps:');
console.log('1. Update the validation schemas in the controller');
console.log('2. Define the proper interfaces in the model file');
console.log('3. Implement the business logic in the service');
console.log('4. Add the controller to your main app.ts file');
console.log('5. Run "npm run generate" to update TSOA routes');
