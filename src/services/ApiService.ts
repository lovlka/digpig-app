export type ApiErrorShape = {
  status: number | null; // null when request didn't reach server
  code?: string;
  message: string;
  details?: unknown;
  url?: string;
  method?: string;
};

export class ApiError extends Error {
  status: number | null;
  code?: string;
  details?: unknown;
  url?: string;
  method?: string;

  constructor(err: ApiErrorShape) {
    super(err.message);
    this.name = 'ApiError';
    this.status = err.status ?? null;
    this.code = err.code;
    this.details = err.details;
    this.url = err.url;
    this.method = err.method;
  }
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
};

class ApiServiceClass {
  private baseUrl: string = process.env.EXPO_PUBLIC_API_URL || '';
  private authToken: string = process.env.EXPO_PUBLIC_API_KEY || '';
  private defaultTimeout = 10000; // 10s

  private makeUrl(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }

  private async request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
    const url = this.makeUrl(path);
    const method = opts.method ?? (opts.body ? 'POST' : 'GET');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {}),
    };

    if (this.authToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? this.defaultTimeout);

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: opts.body != null ? (typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)) : undefined,
        signal: controller.signal,
      } as RequestInit);

      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      let parsed: any = null;
      try {
        if (isJson) {
          parsed = await res.json();
        } else {
          const text = await res.text();
          parsed = text || null;
        }
      } catch {
        // ignore body parse errors
      }

      if (!res.ok) {
        const message = this.buildErrorMessage(res.status, res.statusText, parsed);
        throw new ApiError({
          status: res.status,
          message,
          details: parsed ?? undefined,
          url,
          method,
        });
      }

      return parsed as T;
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        throw new ApiError({ status: null, message: 'Request timed out', url, method });
      }
      if (e instanceof ApiError) throw e;
      throw new ApiError({ status: null, message: e?.message || 'Network error', details: e, url, method });
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildErrorMessage(status: number, statusText: string, body: any): string {
    const base = `Request failed: ${status} ${statusText || ''}`.trim();
    if (!body) return base;
    if (typeof body === 'string') return `${base} - ${body}`;
    if (typeof body === 'object') {
      const msg = (body.message || body.error || body.title) as string | undefined;
      return msg ? `${base} - ${msg}` : base;
    }
    return base;
  }

  // Public helpers
  get<T = any>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(path, { ...opts, method: 'GET' });
    }

  post<T = any>(path: string, body?: any, opts: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(path, { ...opts, method: 'POST', body });
  }

  // Domain specific APIs
  devices = {
    sendMessage: async (deviceId: string, msg: string) => {
      const path = `/devices/${encodeURIComponent(deviceId)}/messages`;
      // The backend also expects id in body per previous implementation example
      return this.post(path, { id: deviceId, msg });
    },
  };
}

export const ApiService = new ApiServiceClass();
export default ApiService;
