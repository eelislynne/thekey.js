import { Connection, createConnection, createPool, MysqlError, Pool, Query } from "mysql";
import Environment from "../environment";

export default class DB {
  private static connection: Pool;

  static connected() {
    return !!this.connection; // && ["authenticated", "connected"].includes(this.connection.state);
  }

  static connect() {
    return new Promise<boolean>((res, rej) => {
      if (this.connected()) {
        return res();
      }

      const pool = createPool(Environment.database);
      pool.on("error", (err: any) => {
        console.log("mysql database error:", err);
        return rej();
      });

      this.connection = pool;

      /*connection.connect((err) => {
        if (err) {
          console.log("mysql connection error: " + err);
          return rej();
        }

        this.connection = connection;
        return res();
      });*/
    });
  }

  static disconnect() {
    if (this.connected()) {
      this.connection.end();
      this.connection = null;
      console.log("mysql disconnected");
    }
  }

  static insert(table: string, value: object) {
    return new Promise(async (resolve, reject) => {
      if (!this.connected()) await this.connect();

      const query = `INSERT INTO ${this.connection.escapeId(table)} SET ?`;

      this.connection.query(query, value, function (err, results) {
        if (err) {
          console.log("mysql error", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static update(
    table: string,
    value: object,
    condition: string = "",
    ...args: any[]
  ) {
    const params: string[] = [];
    let query = `UPDATE ${this.connection.escapeId(table)} SET`;

    const valKeys = Object.keys(value);
    for (const key of valKeys) {
      query += ` ${this.connection.escapeId(key)} = ?,`;
      params.push((value as any)[key]);
    }

    query = query.substr(0, query.length - 1);

    if (condition) {
      query += " WHERE " + condition;

      const args = Array.from(arguments);
      args.splice(0, 3);
      params.push(...args);
    }

    return new Promise(async (resolve, reject) => {
      if (!this.connected()) await this.connect();

      this.connection.query(query, params, function (err, results) {
        if (err) {
          console.log("mysql error", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static delete(table: string, condition: string = "", ...args: any[]) {
    let query = `DELETE FROM ${this.connection.escapeId(table)}`;

    const params: any[] = [];
    if (condition) {
      query += " WHERE " + condition;

      const args = Array.from(arguments);
      args.splice(0, 2);
      params.push(...args);
    }

    return new Promise(async (resolve, reject) => {
      if (!this.connected()) await this.connect();

      this.connection.query(query, params, function (err, results) {
        if (err) {
          console.log("mysql error", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static query(...args: any): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.connected()) await this.connect();

      const a = [...args];

      const query = a.shift();

      this.connection.query(query, a, function (
        err: MysqlError,
        results: any[]
      ) {
        if (err) {
          console.log("mysql error", err);
          reject(err);
        } else {
          for (const res of results) {
            const keys = Object.keys(res);
            for (const key of keys) {
              if (res[key] === "true") res[key] = true;
              if (res[key] === "false") res[key] = false;
            }
          }

          resolve(results);
        }
      });
    });
  }

  static async queryOne(...args: any): Promise<any> {
    const results = await this.query(...args);
    if (!results.length) return null;
    return results[0];
  }
}
