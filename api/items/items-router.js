const router = require("express").Router();

const Items = require('./items-model.js');

router.get('/', (req, res) => {
    Items.find()
    .then(items => {
        res.json(items);
    })
    .catch(err => res.send({message: err}));
});

router.post('/', (req, res) => {
    const itemInfo = req.body;

    if(itemInfo) {
        Items.add(itemInfo)
        .then(newItem => {
            res.status(200).json({ newItem: newItem, message: 'Your item has been added'})
        })
        .catch(err => res.status(500).json({ message: err.message }))
    } else {
        res.status(400).json({ message: 'Name, location, description, and price are required'})
    }
});

module.exports = router;