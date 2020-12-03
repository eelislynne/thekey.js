export default function response(code = 200): Response {
  const res = new Response();
  res.code = code;

  return res;
}

export interface WebResponse {
  code: number;
  data: unknown;
  redirect?: string;
}

class Response {
  public code: number;

  json(data: object | unknown): WebResponse {
    return {
      code: this.code,
      data,
    };
  }

  string(data: string): WebResponse {
    return {
      code: this.code,
      data,
    };
  }

  empty(): WebResponse {
    return {
      code: this.code,
      data: undefined,
    };
  }

  redirect(redirect: string, code = 302) {
    return {
      code,
      redirect,
    };
  }
}
