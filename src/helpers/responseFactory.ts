export interface JsendResponse {
  status: 'success' | 'fail' | 'error';
  data?: unknown;
  message?: string;
  [key: string]: unknown;
}

class ResonseFactory {
  success(data: unknown = {}): JsendResponse {
    return {
      status: 'success',
      data: data,
    };
  }

  fail(data: unknown): JsendResponse {
    return {
      status: 'fail',
      ...(data ? { data } : {}),
    };
  }

  error(data: { [key: string]: unknown } = {}): JsendResponse {
    return {
      status: 'error',
      ...data,
    };
  }
}

const responseFactory = new ResonseFactory();

export default responseFactory;
