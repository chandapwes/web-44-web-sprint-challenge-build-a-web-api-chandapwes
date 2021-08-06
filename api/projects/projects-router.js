// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')
const router = express.Router()
const {
    validateProjectId, 
    validateProject,
    validateAction
} = require('./projects-middleware')

router.get('/', (req, res, next) => {
    Project.get()
        .then(projects => {
            return res.json(projects)
        })
        .catch(next)
})

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.project)
})

router.post('/', validateProject, validateAction, (req, res, next) => {
    Project.insert(req.body)
        .then(newProject => {
            res.status(201).json(newProject)
        })
        .catch(next)
})

router.put('/:id', validateProjectId, validateProject, validateAction, (req, res, next) => {
    Project.update(req.params.id, req.body)
        .then(() => {
            return Project.get(req.params.id)
        })
        .then(project => {
            res.json(project)
        })
        .catch(next)
})

router.delete('/:id', validateProjectId, async (req, res, next) => {
    try {
     await Project.remove(req.params.id)
     res.json(req.project)
    } catch (err) {
        next(err)
    }
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
        const result = await Project.getProjectActions(req.params.id)
        res.json(result)
    } catch (err) {
        next(err)
    }
})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened inside projects router',
        message: err.message,
        stack: err.stack,
    })
})

module.exports = router