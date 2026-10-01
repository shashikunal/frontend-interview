import { describe, it, expect } from 'vitest';
import gatewayHandler from '../../api/_source/gateway.js';

function createMockReqRes(options: { url: string; method?: string; body?: any; headers?: any }) {
  const req: any = {
    url: options.url,
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body || null,
  };

  let statusCode = 200;
  let headers: Record<string, string> = {};
  let responseData: any = null;

  const res: any = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    setHeader: (k: string, v: string) => {
      headers[k.toLowerCase()] = v;
    },
    json: (data: any) => {
      responseData = data;
      return res;
    },
    end: (data?: any) => {
      if (data && !responseData) {
        try {
          responseData = JSON.parse(data);
        } catch {
          responseData = data;
        }
      }
      return res;
    },
    get statusCode() {
      return statusCode;
    },
    get responseData() {
      return responseData;
    },
  };

  return { req, res };
}

describe('API Gateway Integration Tests', () => {
  it('should return 200 for health endpoint', async () => {
    const { req, res } = createMockReqRes({ url: '/api/v1/health' });
    await gatewayHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.responseData?.status).toBe('HEALTHY');
  });

  it('should return 404 for non-existent endpoint', async () => {
    const { req, res } = createMockReqRes({ url: '/api/v1/nonexistent-route' });
    await gatewayHandler(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.responseData?.error).toBe('Endpoint Not Found');
  });

  it('should handle meetings list request', async () => {
    const { req, res } = createMockReqRes({ url: '/api/v1/meetings' });
    await gatewayHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.responseData?.meetings).toBeDefined();
    expect(Array.isArray(res.responseData?.meetings)).toBe(true);
  });

  it('should handle unauthenticated admin meeting creation attempt with 401', async () => {
    const { req, res } = createMockReqRes({
      url: '/api/v1/admin/meetings',
      method: 'POST',
      body: { title: 'Unauthorized Meeting' },
    });
    await gatewayHandler(req, res);
    expect(res.statusCode).toBe(401);
  });
});
