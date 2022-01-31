// ************************************
//             Interfaces
// ************************************

interface IEnvironmentPorts {
  socket_server: number;
  web_server: number;
}
interface IEnvironmentDatabase {
  host: string;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}
abstract class IEnvironment {
  static ports: IEnvironmentPorts;
  static database: IEnvironmentDatabase;
  static ipv4: string;
}

// ********************************
//             Config
// ********************************

export default class Environment extends IEnvironment {
  static ports = {
    web_server: parseInt(process.env.WEB_SERVER_PORT) || 8080,
    socket_server: parseInt(process.env.SOCKET_SERVER_PORT) || 2095,
  };

  static ipv4 = process.env.WEB_SERVER_IP || "0.0.0.0";

  static database = {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db",
  };
}
