// development config

export const envConfig: any = {
    database: {
        DB_URI: '127.0.0.1',
        DB_PORT: 3306,
        DB_USER: 'root',
        DB_PASS: 'gica123',
        DB_MAIN: 'chiara_hnos'
    },
    secretKey: "AC61E5D9696B543E1B139FFF37E064E3",
    emailData: {
      user: 'chiarahnosweb@gmail.com',
      pass: '5549960F3B9066D577CEFA06EFBCE19B',
      from: 'federicocoraglio@gmail.com',
      service: 'Gmail',
    },
    ftpserver: {
      host: 'estudiodellarossa.atwebpages.com',
      port: 21,
      user: '1711021',
      password: 'example987654321',
      logging: 'basic',
      filePath: '/estudiodellarossa.atwebpages.com/test'
    }
};
