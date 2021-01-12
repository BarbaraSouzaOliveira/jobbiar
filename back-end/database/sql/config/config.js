let log = process.env.SEQUELIZE_LOGGING ? console.log : false;

module.exports = {
  development: {
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    dialect: "postgres",
    database: "jobbiar",
    logging: log,
    pool: {
      max: 20,
      min: 0,
      evict: 10000,
      idle: 10000
    },
  }
};
