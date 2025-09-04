require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./config/database");

// Models
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const Like = require("./models/like");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.server = require("http").createServer(this.app);

        // Paths
        this.paths = {
            users: "/api/users",
        };

        // Database connection
        this.connectDB();

        // Json
        this.app.use(express.json());

        // Middlewares
        this.middlewares();

        // Application routes
        this.routes();
    }

    async connectDB() {
        await db.authenticate()
            .then(() => {
                console.log("Database connected successfully");
            })
            .catch((err) => {
                console.error("Unable to connect to the database:", err);
            });
        
        // Add models to the database
        await User.sync({force: false})
        await Post.sync({force: false})
        await Comment.sync({force: false})
        await Like.sync({force: false})
        console.log("Models synchronized with the database");
    }
    
    middlewares() {
        // Logger
        this.app.use(morgan("dev"));

        // Body parser
        this.app.use(express.json());

        // CORS
        this.app.use(cors());
    }
    
    routes() {
        this.app.use(this.paths.users, require("./routes/user.routes"));
    }
    
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;