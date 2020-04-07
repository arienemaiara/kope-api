module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'kope',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    }
};