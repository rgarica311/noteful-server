const express = require('express')
const xss = require('xss')
const logger = require('./logger')

const NotesService = require('./notes-service')

const notesRouter = express.Router()
const bodyParser = express.json()


const serializeNote = note => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  content: xss(note.content),
  folderid: note.folderid
})

notesRouter
  .route('/notes')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    for(const field of ['name', 'modified', 'content', 'folderid']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`${field} is required`)
      }
    }
    const { name, modified, content, folderid } = req.body
    const newNote = { name, modified, content, folderid }

    NotesService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        logger.info(`Note created with id ${note.id}`)
        res.status(201).location(`/notes/${note.id}`)
        .json(serializeNote(note))
      })
      .catch(next)
  })

  notesRouter
    .route('/notes/:id')
    .all((req, res, next) => {
      const { id } = req.params
      NotesService.getNoteById(req.app.get('db'), id)
        .then(note => {
          if(!note) {
            logger.error(`Note with id ${id} not found`)
            return res.status(404).json({
              error:{message: 'Note not found' }
            })
          }
          res.note = note
          next()
        })
        .catch(next)
    })
    .get((req, res) => {
      res.json(serializeNote(res.note))
    })
    .delete((req, res, next) => {
      const { id } = req.params
      NotesService.deleteNote(req.app.get('db'), id)
        .then(numRowsAffected => {
          logger.info(`Note with id ${id} delted`)
          res.status(204).send()
        })
        .catch(next)
    })

    module.exports = notesRouter
