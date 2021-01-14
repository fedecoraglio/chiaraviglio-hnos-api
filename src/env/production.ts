// production config

export const envConfig: any = {
    database: {
        DB_URI: 'chiarahnos.com.ar',
        DB_PORT: 3306,
        DB_USER: 'chiarahn_api',
        DB_PASS: 'V3Ep~J_Ekc=}',
        DB_MAIN: 'chiarahn_chiara_hnos'
    },
    secretKey: "AC61E5D9696B543E1B139FFF37E064E3",
    emailData: { //juan.chiara@chiarahnos.com.ar // Ckq,Mw=V$lum //diego.chiara@chiarahnos.com.ar //d)y-XgsEIMWz
      user: 'sistemas@chiarahnos.com.ar', //'chiarahnosweb@gmail.com', //
      pass: 'R{lb6)UDN=&5', //UVrXbA=+%cX7
      from: 'sistemas@chiarahnos.com.ar',
      service: 'mail.chiarahnos.com.ar',
    },
    ftpserver: {
      host: 'chiarahnos.com.ar',
      port: 21,
      user: 'reportes@api.chiarahnos.com.ar',
      password: 'hcaM?K-wgE*j',
      logging: 'basic',
      filePath: '/data'
    }
};
