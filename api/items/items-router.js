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

router.put(':/id', (req, res) => {
    const { id } = req.params;
    const itemInfo = req.body;
    const item = Items.findById(id);

    if(item){
        if(itemInfo){
            Items.editItem(id, itemInfo)
            .then(editedItem => {
                res.status(200).json({ message: 'The item has been edited' })
            })
            .catch(err => res.status(500).json({message: err.message}))
        } else {
            res.status(400).json({ message: 'Name, location, description, and price are required'})
        }
    } else {
        res.status(404).json({ message: 'No item exists with that item id'})
    }
})

router.delete(':/id', (req, res) => {
    const {id} = req.params;
    const item = Items.findById(id);

    if(item){
        Items.deleteItem(id)
        .then(deletedItem => {
            res.status(200).json({ message: 'The item has been deleted'})
        })
        .catch(err => res.status(500).json({ message: err.message }))
    } else {
        res.status(404).json({ message: 'No item exists with that item id' })
    }
})

module.exports = router;