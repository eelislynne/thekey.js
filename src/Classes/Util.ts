import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { FastifyRequest } from "fastify";

export default class Util {
  public static async hash(data: any) {
    return bcrypt.hash(data, 10);
  }

  public static async hashCompare(plain: any, hash: string) {
    return bcrypt.compare(plain, hash);
  }

  public static md5(string: string) {
    return crypto.createHash("md5").update(string).digest("hex");
  }

  public static getClientIP(req: FastifyRequest) {
    const cfHeader = req.headers["HTTP_CF_CONNECTING_IP"];
    if (!cfHeader) {
      return req.ip;
    }
    return cfHeader as string;
  }

  public static randomStr(
    len: number,
    chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ) {
    const charCount = chars.length;
    let output = "";
    for (let i = 0; i < len; i++) {
      output += chars.charAt(Math.floor(Math.random() * charCount));
    }
    return output;
  }
}
