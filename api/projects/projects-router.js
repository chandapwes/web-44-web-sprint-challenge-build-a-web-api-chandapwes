// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')
const router = express.Router()
const {
    validateProjectId
} = require('./projects-middleware')

router.get('/', (req, res, next) => {
    Project.get()
        .then(projects => {
            return res.json(projects)
        })
        .catch(next)
})

router.get('/:id', validateProjectId, (req,res) => {
    res.json(req.project)
})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened inside projects router',
        message: err.message,
        stack: err.stack,
    })
})

module.exports = router