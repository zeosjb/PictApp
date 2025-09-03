const { DataTypes, Model } = require('sequelize')
const db = require('../config/database')

class Comment extends Model {
    static id
    static content
    static deleted
}

Comment.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db,
    modelName: 'Comment',
    tableName: 'comment',
    timestamps: true
});

Comment.associate = (models) => {
    Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Comment.hasMany(models.Comment, { foreignKey: 'commentId', as: 'replies' });
    Comment.hasMany(models.Like, { foreignKey: 'commentId', as: 'likes' });
    Comment.belongsTo(models.Comment, { foreignKey: 'commentId', as: 'parentComment' });
}

Comment.prototype.toJSON = function () {
    const { ...comment } = this.get()
    return comment
}

module.exports = Comment