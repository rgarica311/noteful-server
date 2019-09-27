const express = require('express')
const xss = require('xss')
const logger = require('./logger')

const FoldersService = require('./folder-service')

const foldersRouter = express.Router()
const bodyParser = express.json()


const serializefolder = folder => ({
  id: folder.id,
  name: xss(folder.name),

})

foldersRouter
  .route('/folders')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map(serializefolder))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    for(const field of ['name']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`${field} is required`)
      }
    }
    const { name } = req.body
    const newfolder = { name }

    FoldersService.insertFolder(req.app.get('db'), newfolder)
      .then(folder => {
        logger.info(`folder created with id ${folder.id}`)
        res.status(201).location(`/folders/${folder.id}`)
        .json(serializefolder(folder))
      })
      .catch(next)
  })

  foldersRouter
    .route('/folders/:id')
    .all((req, res, next) => {
      const { id } = req.params
      console.log('fodler id', id)
      FoldersService.getFolderById(req.app.get('db'), id)
        .then(folder => {
          if(!folder) {
            logger.error(`folder with id ${id} not found`)
            return res.status(404).json({
              error:{message: 'folder not found' }
            })
          }
          res.folder = folder
          next()
        })
        .catch(next)
    })
    .get((req, res) => {
      res.json(serializefolder(res.folder))
    })
    .delete((req, res, next) => {
      const { id } = req.params
      FoldersService.deleteFolder(req.app.get('db'), id)
        .then(numRowsAffected => {
          logger.info(`folder with id ${id} delted`)
          res.status(204).send()
        })
        .catch(next)
    })

    module.exports = foldersRouter
