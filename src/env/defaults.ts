// default config

const config: any = {
    port: process.env.PORT || 61000,
    env: 'development',
    database: {
        client: 'mysql'
    },
    secretKey: "esta es una secret key no muy segura",
    ftpserver: {
      host: 'estudiodellarossa.atwebpages.com',
      port: 21,
      user: '1711021',
      password: 'example987654321',
      logging: 'basic',
      filePath: '/estudiodellarossa.atwebpages.com/test'
    }
};

// Set the current environment or default to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
config.env = process.env.NODE_ENV;

export default config;
