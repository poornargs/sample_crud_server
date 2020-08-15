const ConfigJs = require('../config')
module.exports = require('knex')({
    client: 'mysql',
    connection: {
      host : ConfigJs.database.host,
      user : ConfigJs.database.username,
      password : ConfigJs.database.password,
      database : ConfigJs.database.db
    }
  });

