/*import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';*/
import { FastifyRequest } from "fastify";

export default class Util {
  /*static async hash(data: unknown): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  static async hashCompare(plain: unknown, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  static md5(string: string): string {
    return crypto.createHash("md5").update(string).digest("hex");
  }*/

  static getGlientIP(req: FastifyRequest): string {
    const cfHeader = req.headers["HTTP_CF_CONNECTING_IP"];
    if (!cfHeader) {
      return req.ip;
    }
    return cfHeader as string;
  }

  static randomStr(
    len: number,
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ): string {
    const charCount = chars.length;
    let output = "";
    for (let i = 0; i < len; i++) {
      output += chars.charAt(Math.floor(Math.random() * charCount));
    }
    return output;
  }
}
