export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational = true, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

// not found error
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

// validation error
export class ValidationError extends AppError {
    constructor(message = 'invalid request data', details?: any) {
        super(message, 400, true, details);
    }
}

// Authentication error
export class AuthError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

// Forbidden error
export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}

// Internal server error
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error', details?: any) {
        super(message, 500, false, details);
    }
}

// Database error
export class DatabaseError extends AppError {
    constructor(message = 'Database error', details?: any) {
        super(message, 500, false, details);
    }
}

// Rate limit error
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429);
    }
}

// External service error
export class ExternalServiceError extends AppError {
    constructor(message = 'External service error', details?: any) {
        super(message, 502, false, details);
    }
}

// Bad request error
export class BadRequestError extends AppError {
    constructor(message = 'Bad request', details?: any) {
        super(message, 400, true, details);
    }
}

// Conflict error
export class ConflictError extends AppError {
    constructor(message = 'Resource conflict', details?: any) {
        super(message, 409, true, details);
    }
}

// Service unavailable error
export class ServiceUnavailableError extends AppError {
    constructor(message = 'Service unavailable', details?: any) {
        super(message, 503, false, details);
    }
}

// Timeout error
export class TimeoutError extends AppError {
    constructor(message = 'Request timeout', details?: any) {
        super(message, 504, false, details);
    }
}
