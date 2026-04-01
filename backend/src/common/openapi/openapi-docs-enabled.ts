export function isOpenApiDocsEnabled(): boolean {
  const v = process.env.ENABLE_OPENAPI_DOCS ?? process.env.ENABLE_SWAGGER;
  if (v === 'true') {
    return true;
  }
  if (v === 'false') {
    return false;
  }
  const nodeEnv = process.env.NODE_ENV;
  return !nodeEnv || nodeEnv === 'development';
}
