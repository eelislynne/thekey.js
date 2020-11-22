import 'module-alias/register';

export default class Environment {
  static port = 8080;
  static url = "http://localhost";

  static database = {
    enabled: false,
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "test_database",
  };
}
