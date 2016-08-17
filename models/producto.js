
module.exports = function(sequelize, DataTypes) {
    var Producto = sequelize.define('producto', {
        descripcion: DataTypes.TEXT,
        modelo: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        existencia: DataTypes.FLOAT
    });

    return Producto;
};