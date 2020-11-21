export default class Environment {
  static port = 8080;

  static database = {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "benchmark",
  };
}
