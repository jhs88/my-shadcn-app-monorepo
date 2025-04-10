import type { ErrorResponse } from "react-router";
import { isRouteErrorResponse } from "react-router";

type ErrorFallbackProps = {
  error: ErrorResponse | Error | unknown;
};

export function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="error-page">
      <div>
        <h1>{isRouteErrorResponse(error) ? error.status : 500}</h1>
        <p>
          {isRouteErrorResponse(error)
            ? (error.data.message ?? error.data)
            : error instanceof Error
              ? error.message
              : "An Unknown error occurred"}
        </p>
      </div>
    </div>
  );
}

export default ErrorFallback;
