# Axios Configuration

Professional Axios setup with interceptors, error handling, and service layer architecture.

## Structure

```
src/lib/axios/
├── config.ts              # Axios instance with interceptors
├── api.ts                 # Generic API service class
├── endpoints.ts           # Centralized endpoint definitions
├── index.ts              # Main export file
├── services/
│   ├── authService.ts    # Authentication API calls
│   └── userService.ts    # User management API calls
└── README.md
```

## Features

- ✅ Request/Response interceptors
- ✅ Automatic token management
- ✅ Token refresh on 401
- ✅ Request/Response logging (dev mode)
- ✅ Error handling
- ✅ TypeScript support
- ✅ Service layer pattern
- ✅ File upload/download
- ✅ Centralized endpoints

## Usage

### Basic API Calls

```typescript
import { api } from '@/lib/axios'

// GET request
const users = await api.get('/users')

// POST request
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' })

// PUT request
const updated = await api.put('/users/1', { name: 'Jane' })

// DELETE request
await api.delete('/users/1')
```

### Using Services

```typescript
import { authService, userService } from '@/lib/axios'

// Login
const { user, accessToken } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Get profile
const profile = await userService.getProfile()

// Update profile
const updated = await userService.updateProfile({
  name: 'New Name'
})
```

### File Upload

```typescript
import { userService } from '@/lib/axios'

const file = event.target.files[0]

// With progress tracking
const result = await userService.uploadAvatar(file, (progress) => {
  console.log(`Upload progress: ${progress}%`)
})
```

### Error Handling

```typescript
import { api, ApiError } from '@/lib/axios'

try {
  const data = await api.get('/users')
} catch (error) {
  const apiError = error as ApiError
  console.error(apiError.message)
  console.error(apiError.statusCode)
  console.error(apiError.errors) // Validation errors
}
```

### Using Endpoints

```typescript
import { api, API_ENDPOINTS } from '@/lib/axios'

// Static endpoint
await api.get(API_ENDPOINTS.USERS.PROFILE)

// Dynamic endpoint
await api.get(API_ENDPOINTS.USERS.BY_ID('123'))
await api.get(API_ENDPOINTS.PRODUCTS.BY_CATEGORY('electronics'))
```

### Direct Axios Instance

```typescript
import { axiosInstance } from '@/lib/axios'

// For custom requests
const response = await axiosInstance({
  method: 'GET',
  url: '/custom-endpoint',
  headers: { 'Custom-Header': 'value' }
})
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NODE_ENV=development
```

### Adding New Services

1. Create service file in `services/` directory:

```typescript
// src/lib/axios/services/productService.ts
import { api } from '../api'
import { API_ENDPOINTS } from '../endpoints'

export interface Product {
  id: string
  name: string
  price: number
}

class ProductService {
  async getAll(): Promise<Product[]> {
    return api.get(API_ENDPOINTS.PRODUCTS.BASE)
  }

  async getById(id: string): Promise<Product> {
    return api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id))
  }

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    return api.post(API_ENDPOINTS.PRODUCTS.BASE, data)
  }
}

export const productService = new ProductService()
```

2. Add endpoints to `endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
  },
}
```

3. Export from `index.ts`:

```typescript
export { productService } from './services/productService'
export type { Product } from './services/productService'
```

## Interceptors

### Request Interceptor
- Adds Authorization header with token
- Logs requests in development
- Adds request timestamp

### Response Interceptor
- Logs responses in development
- Handles 401 (token refresh)
- Handles 403, 404, 500 errors
- Handles network errors

## Token Management

Tokens are automatically:
- Added to requests via Authorization header
- Refreshed on 401 response
- Stored in localStorage
- Cleared on logout

## Best Practices

1. **Use Services**: Create service classes for related API calls
2. **Centralize Endpoints**: Define all endpoints in `endpoints.ts`
3. **Type Everything**: Use TypeScript interfaces for requests/responses
4. **Handle Errors**: Always wrap API calls in try-catch
5. **Use Environment Variables**: Never hardcode API URLs

## Integration with Redux

```typescript
// In Redux slice
import { createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '@/lib/axios'

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
```
