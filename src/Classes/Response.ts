export default function response(code = 200) {
  const res = new Response();
  res.code = code;

  return res;
}

export interface WebResponse {
  code: number;
  data: any;
  redirect?: string;
}

class Response {
  public code: number;

  json(data: object | any): WebResponse {
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
