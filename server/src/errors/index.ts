type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500;

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: StatusCode;

  constructor(code: string, message: string, statusCode: StatusCode) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super("VALIDATION_ERROR", message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super("NOT_FOUND", `${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super("CONFLICT", message, 409);
  }
}
