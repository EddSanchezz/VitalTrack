// Utility helpers for consistent API responses and validation

export function errorResponse(res, status, code, message, details = undefined) {
  const payload = { error: { code, message } };
  if (details) payload.error.details = details;
  return res.status(status).json(payload);
}

export function notFound(res, resource = 'Recurso') {
  return errorResponse(res, 404, 'not_found', `${resource} no encontrado`);
}

export function conflict(res, message) {
  return errorResponse(res, 409, 'conflict', message);
}

export function badRequest(res, message, details) {
  return errorResponse(res, 400, 'bad_request', message, details);
}

export function validateRequired(res, body, fields) {
  const missing = fields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    badRequest(res, 'Faltan campos requeridos', { missing });
    return false;
  }
  return true;
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
