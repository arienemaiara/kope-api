require('../bootstrap');

module.exports = {
    development: {
        dialect: process.env.DATABASE_DIALECT || 'postgres',
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        storage: './__tests__/database.sqlite',
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        }
    },
    test: {
        dialect: process.env.DATABASE_DIALECT || 'sqlite',
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        storage: './__tests__/database.sqlite',
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        }
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        }
    }
};