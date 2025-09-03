module.exports = {
  "development": {
    "database": "pict_app",
    "dialect": "sqlite",
    "storage": "./src/database/pict_app.sqlite"
  },
  "test": {
    "database": "pict_app_test",
    "dialect": "sqlite"
  },
  "production": {
    "database": "pict_app_production",
    "dialect": "sqlite"
  }
}
