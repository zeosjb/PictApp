# PictApp

## Descripción
Proyecto en clases a seguir de backend para nuestra aplicación similar a instagram.

## Inicialización del proyecto
```
  npm init -y
```

## Dependencias o Liberías a instalar
```
    npm install express express-validator cors sequelize sequelize-cli sqlite3 bcryptjs jsonwebtoken dotenv nodemon
```

## Dependencia de desarrollo

```
    npm install --save-dev morgan
```

## Pasos a seguir

* Crear una carpeta inicial dentro de nuestro proyecto llamada src
* Añadir un archivo llamado .env para subir nuestra información de desarrollo.
* Crear un archivo .gitignore para escribir los elementos que no serán subidos a github.
* Crear dentro del proyecto un archivo .sequelizerc Para inicializar Sqlite y copiar la información del archivo en este repositorio.
* Correr el comando para crear config, models, migrations and seeders a modo de ORM:
```
      npx sequelize init 
```
* Para instalar las librerias
```
    npm install
```
* Para crear una migración
```
    npx sequelize-cli migration:generate --name <nombre creacion de tabla ej: create-user>
```
* Los scripts están dentro del archivo package.json:
   ```
  "main": "./src/app.js",
  "scripts": {
    "dev": "nodemon",
    "db:migrate:up": "npx sequelize-cli db:migrate",
    "db:migrate:down": "npx sequelize-cli db:migrate:undo"
  },
  ```
* Para correr el proyecto
```
    npm run dev
```
* Adicional
```
    npm start
```
