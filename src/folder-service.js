const FolderService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders')
  },
  getFolderById(knex, id) {
    return knex.select('*').from('folders').where('id', id).first()
  },
  insertFolder(knex, newFolder) {
    return knex.insert(newFolder).into('folders').returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteFolder(knex, id) {
    return knex('folders').where({id}).delete()
  },
  updateFolder(knex, id, newFolderFields) {
    return knex('folders').update(newFolderFields).where({id})
  }
}

module.exports = FolderService
