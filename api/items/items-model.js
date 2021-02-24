const db = require('../../database/dbConfig.js');

module.exports = {
    add,
    find,
    findBy,
    findById,
    editItem,
    deleteItem,
}

function find() {
    return db('items')
}

function findBy(filter) {
    return db('items').where(filter).orderBy('id');
} 

function findById(id) {
    return db('items').where({ id }).first();
}

async function add(item) {
    const [id] = await db('items').insert(item, 'id');
    return findById(id);
}

function editItem(id, body) {
    return db('items').where({id}).update(body);
}

function deleteItem(id) {
    return db('items').where({id}).del();
}