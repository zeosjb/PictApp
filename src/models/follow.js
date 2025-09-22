const { DataTypes, Model } = require('sequelize');
const db = require('../config/database');

class Follow extends Model {
    static id
}

Follow.init({
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Follow',
    tableName: 'follows',
    timestamps: true
});

Follow.associate = (models) => {
    Follow.belongsTo(models.User, { foreignKey: 'followerId', as: 'follower' });
    Follow.belongsTo(models.User, { foreignKey: 'followingId', as: 'following' });
}

Follow.prototype.toJSON = function () {
    const { ...follow } = this.get();
    return follow;
}

module.exports = Follow;