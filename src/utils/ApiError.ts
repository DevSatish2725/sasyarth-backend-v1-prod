/**
 * ============================================================
 * File: ApiError.ts
 *
 * Purpose:
 * Represents application-specific errors with an HTTP
 * status code.
 *
 * Business Context:
 * GreenBridge needs meaningful errors that the global
 * error handler can convert into proper API responses.
 *
 * Responsibility:
 * Encapsulate an HTTP status code together with an error
 * message.
 * ============================================================
 */

export class ApiError extends Error {
  /**
   * Creates a new API error.
   *
   * @param statusCode HTTP status code.
   * @param message Error description.
   */
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);

    /**
     * Preserve the correct class name.
     */
    this.name = "ApiError";

    /**
     * Maintains the proper stack trace.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}
