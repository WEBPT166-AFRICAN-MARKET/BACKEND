const knex = require('knex')('development');
const knexConfig = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';

module.exports = knex(knexConfig[environment]);