// src/app.ts
import express, { Response as ExResponse, Request as ExRequest, urlencoded, json, NextFunction } from "express";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { responseInterceptor } from "./common/middleware/response.interceptor";
import { exceptionHandler } from "./common/middleware/exception.handler";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

// Add response interceptor middleware to wrap all responses in generic format
app.use(responseInterceptor);

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(
        swaggerUi.generateHTML(await import("../build/swagger.json"))
    );
});

RegisterRoutes(app);

// Handle TSOA validation errors first (before our custom exception handler)
app.use(function validationErrorHandler(
  err: unknown,
  _req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    // Clean up the field names by removing "requestBody" prefix
    const cleanedFields: { [key: string]: any } = {};
    
    if (err.fields) {
      Object.keys(err.fields).forEach(key => {
        // Remove "requestBody." prefix from field names
        const cleanKey = key.replace(/^requestBody\./, '');
        cleanedFields[cleanKey] = err.fields[key]?.['message'] ?? '';
      });
    }
    
    return res.status(422).json({
        status: 422,
        message: "Validation Failed",
        data: null,
        errors: cleanedFields,
    });
  }

  // Pass to our custom exception handler
  next(err);
});

// Use our custom exception handler for other errors
app.use(exceptionHandler);

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).json({
    status: 404,
    message: "Not Found",
    data: null
  });
});
