import { createPool, MysqlError, Pool } from 'mysql';
import Environment from '../environment';

export default class DB {
  private static connection: Pool;

  static connected(): boolean {
    return !!this.connection;
  }

  static connect(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      if (this.connected()) {
        return res();
      }

      const pool = createPool(Environment.database);
      pool.on('error', (err: MysqlError) => {
        console.log('mysql database error:', err);
        return rej();
      });

      this.connection = pool;
    });
  }

  static disconnect(): void {
    if (this.connected()) {
      this.connection.end();
      this.connection = null;
      console.log('mysql disconnected');
    }
  }

  static async insert(table: string, value: object): Promise<object> {
    if (!this.connected()) await this.connect();
    return new Promise((resolve, reject) => {

      const query = `INSERT INTO ${this.connection.escapeId(table)} SET ?`;

      this.connection.query(query, value, function (err, results) {
        if (err) {
          console.log('mysql error', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async update(
    table: string,
    value: Record<string, unknown>,
    condition = '',
    ...parameters: unknown[]): Promise<object> {
    const params: unknown[] = [];
    let query = `UPDATE ${this.connection.escapeId(table)} SET`;

    const valKeys = Object.keys(value);
    for (const key of valKeys) {
      query += ` ${this.connection.escapeId(key)} = ?,`;
      params.push(value[key]);
    }

    query = query.substr(0, query.length - 1);

    if (condition) {
      query += ' WHERE ' + condition;

      const args = Array.from(parameters);
      // args.splice(0, 3);
      params.push(...args);
    }
    
    if (!this.connected()) await this.connect();
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, function (err, results) {
        if (err) {
          console.log('mysql error', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });    
  }

  static async delete(table: string, condition = '', ...parameters: unknown[]): Promise<object> {
    let query = `DELETE FROM ${this.connection.escapeId(table)}`;

    const params: unknown[] = [];
    if (condition) {
      query += ' WHERE ' + condition;

      const args = Array.from(parameters);
      // args.splice(0, 2);
      params.push(...args);
    }

    if (!this.connected()) await this.connect();
    return new Promise((resolve, reject) => {

      this.connection.query(query, params, function (err, results) {
        if (err) {
          console.log('mysql error', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async query(...args: string[]): Promise<object[]> {
    if (!this.connected()) await this.connect();
    return new Promise((resolve, reject) => {

      const a = [...args];

      const query = a.shift();

      this.connection.query(query, a, function (
        err: MysqlError,
        results: Record<string, unknown>[]
      ) {
        if (err) {
          console.log('mysql error', err);
          reject(err);
        } else {
          for (const res of results) {
            const keys = Object.keys(res);
            for (const key of keys) {
              if (res[key] === 'true') res[key] = true;
              if (res[key] === 'false') res[key] = false;
            }
          }

          resolve(results);
        }
      });
    });
  }

  static async queryOne(...args: string[]): Promise<object> {
    const results = await this.query(...args);
    if (!results.length) return null;
    return results[0];
  }
}
