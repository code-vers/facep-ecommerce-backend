import { OpenApiGeneratorV3, OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AuthValidation } from '../modules/auth/auth.validation';
import { UserValidation } from '../modules/user/user.validation';

// Extend Zod to support OpenAPI
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// Register Bearer Auth
const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
});

// --- Auth Routes ---
registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  request: {
    body: {
      content: {
        'application/json': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          schema: (AuthValidation.register as any).shape.body
        }
      }
    }
  },
  responses: {
    201: { description: 'User registered successfully.' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/login',
  tags: ['Auth'],
  summary: 'Login user',
  request: {
    body: {
      content: {
        'application/json': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          schema: (AuthValidation.login as any).shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'User logged in successfully.' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/refresh-token',
  tags: ['Auth'],
  summary: 'Refresh access token',
  responses: {
    200: { description: 'Access token generated successfully.' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/change-password',
  tags: ['Auth'],
  summary: 'Change password',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          schema: (AuthValidation.changePassword as any).shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'Password changed successfully.' }
  }
});

// --- User Routes ---
registry.registerPath({
  method: 'get',
  path: '/api/v1/users/me',
  tags: ['Users'],
  summary: 'Get current user profile',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'User profile retrieved successfully.' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/users',
  tags: ['Users'],
  summary: 'Get all users',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: z.object({
      searchTerm: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.string().optional()
    })
  },
  responses: {
    200: { description: 'Users retrieved successfully.' }
  }
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/users/{id}/role',
  tags: ['Users'],
  summary: 'Change user role',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'User ID' })
    }),
    body: {
      content: {
        'application/json': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          schema: (UserValidation.changeRole as any).shape.body
        }
      }
    }
  },
  responses: {
    200: { description: 'User role updated successfully.' }
  }
});

export const generateSwaggerDocs = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Backend API Boilerplate',
      description: 'API Documentation for the backend boilerplate.'
    },
    servers: [{ url: '/' }]
  });
};
