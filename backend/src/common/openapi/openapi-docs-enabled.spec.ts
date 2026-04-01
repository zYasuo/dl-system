import { isOpenApiDocsEnabled } from './openapi-docs-enabled';

describe('isOpenApiDocsEnabled', () => {
  const saved = {
    NODE_ENV: process.env.NODE_ENV,
    ENABLE_OPENAPI_DOCS: process.env.ENABLE_OPENAPI_DOCS,
    ENABLE_SWAGGER: process.env.ENABLE_SWAGGER,
  };

  afterEach(() => {
    process.env.NODE_ENV = saved.NODE_ENV;
    if (saved.ENABLE_OPENAPI_DOCS === undefined) delete process.env.ENABLE_OPENAPI_DOCS;
    else process.env.ENABLE_OPENAPI_DOCS = saved.ENABLE_OPENAPI_DOCS;
    if (saved.ENABLE_SWAGGER === undefined) delete process.env.ENABLE_SWAGGER;
    else process.env.ENABLE_SWAGGER = saved.ENABLE_SWAGGER;
  });

  it('is true when ENABLE_OPENAPI_DOCS=true regardless of NODE_ENV', () => {
    process.env.ENABLE_OPENAPI_DOCS = 'true';
    process.env.NODE_ENV = 'production';
    expect(isOpenApiDocsEnabled()).toBe(true);
  });

  it('is false when ENABLE_OPENAPI_DOCS=false', () => {
    process.env.ENABLE_OPENAPI_DOCS = 'false';
    process.env.NODE_ENV = 'development';
    expect(isOpenApiDocsEnabled()).toBe(false);
  });

  it('defaults on for development or unset NODE_ENV', () => {
    delete process.env.ENABLE_OPENAPI_DOCS;
    delete process.env.ENABLE_SWAGGER;
    process.env.NODE_ENV = 'development';
    expect(isOpenApiDocsEnabled()).toBe(true);
    delete process.env.NODE_ENV;
    expect(isOpenApiDocsEnabled()).toBe(true);
  });

  it('defaults off for staging-like NODE_ENV', () => {
    delete process.env.ENABLE_OPENAPI_DOCS;
    delete process.env.ENABLE_SWAGGER;
    process.env.NODE_ENV = 'staging';
    expect(isOpenApiDocsEnabled()).toBe(false);
  });
});
