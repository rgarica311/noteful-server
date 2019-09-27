module.exports = {
  PORT: process.env.PORT || 8005,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://rorygarcia@localhost/notes',
  DB_URL_TEST: process.env.DB_URL_TEST || 'postgresql://rorygarcia@localhost/test-notes'
}
