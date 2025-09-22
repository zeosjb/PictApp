const { DataTypes, Model } = require('sequelize')
const db = require('../config/database')

class User extends Model {
    static id
    static userName
    static email
    static password
    static profilePicture
    static bio
    static birthDay
    static deleted
}

User.init({
    userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Cloudinary
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthDay: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // Soft delete
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'user',
    timestamps: true
})

User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' })
    User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' })
    User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' })
    User.hasMany(models.Follow, { foreignKey: 'followerId', as: 'following' });
    User.hasMany(models.Follow, { foreignKey: 'followingId', as: 'followers' });
}

User.prototype.toJSON = function () {
    const { password, ...user } = this.get();
    delete password
    return user;
}

module.exports = User;