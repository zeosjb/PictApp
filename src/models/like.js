const { DataTypes, Model } = require('sequelize')
const db = require('../config/database')

class Like extends Model {
    static id
    static deleted
}

Like.init({
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db,
    modelName: 'Like',
    tableName: 'like',
    timestamps: true
});

Like.associate = (models) => {
    Like.belongsTo(models.Comment, { foreignKey: 'commentId', as: 'comment' });
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
}

Like.prototype.toJSON = function () {
    const { ...like } = this.get()
    return like
}

module.exports = Like