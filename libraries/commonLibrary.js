const ConfigJs = require('../config');
const { resolve } = require('path');
const Knex = require('../models/knex')

const log = async (...args) => {
        console.log(...args)
}

function insertOrUpdate(Knex, tableName, data) {
    const firstData = data[0] ? data[0] : data;
    return Knex.raw(
        `${Knex(tableName)
            .insert(data)
            // .transacting(trx)
            .toQuery()} ON DUPLICATE KEY UPDATE ${Object.getOwnPropertyNames(
                firstData
            )
                .map(field => `${field}=VALUES(${field})`)
                .join(',')}`
    );
}

const getExtension = async (base64) => {
    return await new Promise((res) => {
        resolve(base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64')));
    })
}

module.exports = {
    log, insertOrUpdate, getExtension
}