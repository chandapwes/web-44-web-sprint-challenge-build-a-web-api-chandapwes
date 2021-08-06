// Write your "actions" router here!
const express = require('express')
const Action = require('./actions-model')
const router = express.Router()
const {
    validateActionId,
    validateAction,
    validateDescription
} = require('./actions-middlware')

router.get('/', (req, res, next) => {
    Action.get()
        .then(actions => {
            return res.json(actions)
        })
        .catch(next)
})

router.get('/:id', validateActionId, (req, res) => {
  res.json(req.action)
})

router.post('/', validateAction, validateDescription, (req, res, next) => {
    Action.insert(req.body)
        .then(newAction => {
            res.status(201).json(newAction)
        })
        .catch(next)
})

router.put('/:id', validateActionId, validateAction, (req, res, next) => {
    Action.update(req.params.id, req.body)
        .then(() => {
            return Action.get(req.params.id)
        })
        .then(action => {
            res.json(action)
        })
        .catch(next)
})

router.delete('/:id', validateActionId, async (req, res, next) => {
    try {
        await Action.remove(req.params.id)
        res.json(req.action)
    } catch (err) {
        next(err)
    }
})

router.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened inside actions router',
        message: err.message,
        stack: err.stack,
    })
})

module.exports = router