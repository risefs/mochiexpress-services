# 🚀 Guide: How NestJS APIs Work

This guide explains the fundamental concepts of NestJS based on the MochiExpress Services project structure.

## 🏗️ Basic Architecture

NestJS follows a modular architecture inspired by Angular, organizing code into **Modules**, **Controllers**, and **Services**.

```
src/
├── app.module.ts          # Root module
├── users/                 # Domain module
│   ├── users.module.ts    # Module
│   ├── users.controller.ts # Controller
│   ├── users.service.ts   # Service
│   └── entities/          # Entities
└── supabase/              # Infrastructure module
    ├── supabase.module.ts
    └── supabase.service.ts
```

## 🔄 HTTP Request Flow

### 1. **Client → Controller**
```typescript
@Controller('users')  // Base route: /api/v1/users
export class UsersController {
  
  @Get()  // GET /api/v1/users
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
```

### 2. **Controller → Service**
```typescript
@Injectable()
export class UsersService {
  
  async findAll(): Promise<User[]> {
    // Business logic
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*');
    
    return data;
  }
}
```

### 3. **Service → Database → Response**

## 📦 Key Components

### **Modules** (`@Module()`)
Organize the application into functional blocks and manage dependency injection.

```typescript
@Module({
  imports: [SupabaseModule],        // Modules it needs
  controllers: [UsersController],   // Module controllers
  providers: [UsersService],        // Available services
  exports: [UsersService],          // Services other modules can use
})
export class UsersModule {}
```

### **Controllers** (`@Controller()`)
Handle HTTP requests and define API routes.

```typescript
@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {} // DI
  
  @Get()                    // Route decorator
  @ApiOperation({...})      // Swagger documentation
  async findAll() {         // Endpoint method
    return await this.usersService.findAll();
  }
}
```

### **Services** (`@Injectable()`)
Contain business logic and can be injected into other components.

```typescript
@Injectable()
export class UsersService {
  
  constructor(private readonly supabaseService: SupabaseService) {}
  
  async findAll(): Promise<User[]> {
    // Business logic here
  }
}
```

## 🎯 Core Concepts

### **Dependency Injection (DI)**
NestJS automatically handles creation and injection of dependencies:

```typescript
// Service is automatically injected in constructor
constructor(private readonly usersService: UsersService) {}
```

### **Decorators**
Add metadata and functionality to classes and methods:

```typescript
@Controller('users')           // Define controller
@Get()                        // Define HTTP method
@ApiOperation({...})          // Documentation
@Injectable()                 // Mark as injectable
```

### **Global Middlewares and Filters**
Applied to the entire application:

```typescript
// In main.ts
app.useGlobalPipes(new ValidationPipe());     // Automatic validation
app.useGlobalFilters(new HttpExceptionFilter()); // Error handling
```

## 🛠️ Implemented Patterns

### **1. Separation of Concerns**
- **Controller**: Only handles HTTP, delegates logic to service
- **Service**: Contains business logic
- **Module**: Organizes and configures dependencies

### **2. Centralized Configuration**
```typescript
// Environment variables validated at startup
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateConfig,  // Mandatory validation
      isGlobal: true,           // Available app-wide
    }),
  ],
})
```

### **3. Consistent Error Handling**
```typescript
// Global filter that catches all exceptions
@Catch()
export class HttpExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Consistent response for all errors
  }
}
```

## 📊 Example: Complete GET /users Flow

```bash
1. Client makes: GET /api/v1/users
2. NestJS receives the request
3. Finds controller: @Controller('users')
4. Finds method: @Get() findAll()
5. Executes: usersService.findAll()
6. Service queries Supabase
7. Returns data to controller
8. Controller returns JSON to client
```

## 🔧 NestJS Advantages

- **Native TypeScript**: Strong typing and autocompletion
- **Decorators**: Declarative and readable code
- **DI Container**: Automatic dependency management
- **Modularity**: Organized and reusable code
- **Testing**: Easy mocking and injection for tests
- **Ecosystem**: Integration with popular libraries

## 📚 Automatic Documentation

With Swagger, each endpoint is automatically documented:

```typescript
@Get()
@ApiOperation({ summary: 'Get all users' })
@ApiResponse({ status: 200, type: [User] })
async findAll(): Promise<User[]> {
  // Documentation is generated automatically
}
```

## 💡 Next Steps

To extend the API:

1. **New endpoint**: Add method to controller with decorator
2. **New functionality**: Create method in service
3. **New module**: For different domains (products, orders, etc.)
4. **Middleware**: For authentication, logging, etc.

---

**This architecture makes APIs scalable, maintainable, and easy to test.**
