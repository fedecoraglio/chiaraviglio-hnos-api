// default config

const config: any = {
    port: process.env.PORT || 61000,
    env: '',
    database: {
        client: ''
    },
    secretKey: "",
    ftpserver: {
      host: '',
      port: ,
      user: '',
      password: '',
      logging: '',
      filePath: ''
    }
};

// Set the current environment or default to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
config.env = process.env.NODE_ENV;

export default config;
