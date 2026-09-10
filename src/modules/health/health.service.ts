/**
 * ============================================================
 * File: health.service.ts
 *
 * Purpose:
 * Contains the business logic for the Health module.
 *
 * Business Context:
 * Allows monitoring systems (AWS, Load Balancer, Docker,
 * Kubernetes, etc.) to verify that the API is running.
 *
 * Responsibility:
 * Return application health information.
 * ============================================================
 */

export const getHealthStatus = () => {
  return {
    status: "UP",
    service: "GreenBridge API",
    timestamp: new Date().toISOString(),
  };
};