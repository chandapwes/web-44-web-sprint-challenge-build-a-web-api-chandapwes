// add middlewares here related to actions
const Action = require('./actions-model')

async function validateActionId(req, res, next) {
    try {
        const action = await Action.get(req.params.id)
        if (!action) {
            res.status(404).json({
                message: 'action not found',
            })
        } else {
            req.action = action
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: 'problem finding action'
        })
    }
}

function validateAction(req, res, next) {
    const { notes } = req.body
    if (!notes || !notes.trim()) {
        res.status(400).json({
            message: 'notes required'
        })
    } else {
        req.notes = notes.trim()
        next()
    }
}

function validateDescription(req, res, next) {
    const { description } = req.body
    if (!description || !description.trim()) {
        res.status(400).json({
            message: 'description required',
        })
    } else {
        req.description = description.trim()
        next()
    }
}

module.exports = {
    validateActionId,
    validateAction,
    validateDescription,
}