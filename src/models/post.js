const { DataTypes, Model } = require('sequelize')
const db = require('../config/database')

class Post extends Model {
    static id
    static image
    static imageFooter
    static likeCount
    static location
    static deleted
}

Post.init({
    // Cloudinary
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageFooter: {
        type: DataTypes.STRING,
        allowNull: true
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Soft delete
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Post',
    tableName: 'post',
    timestamps: true
})

Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId', as: 'author' })
    Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' })
    Post.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' })
}

Post.prototype.toJSON = function () {
    const { ...post } = this.get();
    return post;
}

module.exports = Post;