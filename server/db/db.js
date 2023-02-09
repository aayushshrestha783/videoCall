const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const { Sequelize } = require("sequelize");

const port = process.env.PORT || 3000;
// const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DATABASE_URL } = process.env; // destructuring the object
let db;
if (process.env.NODE_ENV === "production") {
  db = new Sequelize(DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}
if (process.env.NODE_ENV === "development") {
  db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres",
    logging: console.log,
    operatorsAliases: true,
  });
}
// this runs when unhandle promise rejection is found in the code
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(err.name, err.message);
  process.exit();
});
db.sync();
module.exports = db;
