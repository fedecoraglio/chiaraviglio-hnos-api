import UserModel from '../models/user.model';
import ClientModel from '../models/client.model';
import { Md5 } from 'ts-md5/dist/md5';
import * as jwt  from 'jsonwebtoken';
import { default as config } from '../env/index';
import * as nodemailer from 'nodemailer';

/**
 * Error codes(1-99):
 * 1: Name is required
 * 2: Email is required
 * 3: Password is required
 * 4: Id Number is required(e.g: cuit)
 * 5: Create user data base error message
 * 6: Email is already taken
 * 7: Get user by email data base error message
 * 8: Update user data base error message
 * 9: Get user by id data base error message
 * 10: User not found
 * 11: Get user by email and password data base error message
 * 12: User is not allowed to perform this action
 * 13: You must be client. Please contact with the company
 * 14: Change password data base error message
 * 15: Error sending reset password email
 */
export default class UserService {

  public getUserById(userId, nextSuccess, nextError) {
    let userModel = new UserModel();
    userModel.getUserById(userId).then((rowsUser) => {
      if(rowsUser && rowsUser.length > 0) {
        const user = rowsUser[0];
        nextSuccess({
          id: user.usr_id,
          name: user.usr_name,
          email: user.usr_email,
          idNumber: user.usr_id_number,
          accountNumber: user.usr_account_number
        });
      } else {
        nextError({
          code: 10,
          error: "User not found"
        });
      }
    }).catch((error) => {
      console.error(error)
      nextError({
        code: 10,
        error: `User not found.Msg: ${error.sqlMessage}`
      });
    });
  }

  public saveUser(userData, nextSuccess, nextError) {
    let error = this.isUserCreateDataValid(userData);
    if (error) {
      nextError(error);
    } else {
      let clientModel = new ClientModel();
      clientModel.selectClientByIdNumber(userData.idNumber).then((clientRows) => {
        if(clientRows && clientRows.length === 1) {
          let userModel = new UserModel();
          userModel.getUserByEmail(userData.email).then((rowsEmail) => {
            if (rowsEmail && rowsEmail.length === 0) {
              let client = clientRows[0];
              userModel.createUser(userData.name, userData.email, userData.idNumber, 
                                   Md5.hashStr(userData.password).toString(), client.cli_account_number)
                .then((userCreatedData) => {
                  nextSuccess({
                    id: userCreatedData.insertId,
                    name: userData.name,
                    email: userData.email,
                    idNumber: userData.idNumber
                  });
                }).catch((error) => {
                  nextError({
                    code: 5,
                    error: error.sqlMessage
                  });
                });
            } else {
              nextError({
                code: 6,
                error: "Email is already taken"
              });
            }
          }).catch((errorMail) => {
            nextError({
              code: 7,
              error: errorMail.sqlMessage
            });
          });
        } else {
          nextError({
            code: 13,
            error: "You must be client. Please contact with the company"
          });
        }
      });
    }
  }

  public updatePassword(idAuth, userData, nextSuccess, nextError) {
    if(idAuth !== parseInt(userData.id)) {
      nextError({
        code: 12,
        error: "User is not allowed to perform this action"
      });
    } else {
      const userModel = new UserModel();
      userModel.updatePassword(idAuth, Md5.hashStr(userData.password).toString())
      .then(() => {
        nextSuccess({
          id: idAuth,
          message: "Password was changed successfully"
        });
      }, (errorResponse) => {
        nextError({
          code: 14,
          error: errorResponse.sqlMessage
        });
      });
    }
  }

  public updateUser(idAuth, userData, nextSuccess, nextError) {
    let userModel = new UserModel();
    if(idAuth !== parseInt(userData.id)) {
      nextError({
        code: 12,
        error: "User is not allowed to perform this action"
      });
    } else {
      userModel.getUserById(userData.id)
      .then((userRows) => {
        if(userRows && userRows.length > 0) {
          let userOriginal = userRows[0];
          let userOriginalData = {
            id: userData.id,
            name:  userOriginal.usr_name,
            email: userOriginal.usr_email,
            idNumber: userOriginal.usr_id_number
          }
          if(userData.name) {
            userOriginalData.name = userData.name;
          }
          if(userData.idNumber) {
            userOriginalData.idNumber = userData.idNumber;
          }
          userModel.updateUser(userOriginalData.id, userOriginalData.name, userOriginalData.idNumber)
          .then(() => {
            nextSuccess(userOriginalData);
          }).catch((errorUpdate) => {
            nextError({
              code: 8,
              error: errorUpdate.sqlMessage
            });
          });
        }
      }).catch((error) => {
        console.error(error);
        nextError({
          code: 9,
          error: error.sqlMessage
        });
      });
    }
  }

  public authenticateUser(userData, nextSuccess, nextError) {
    let userModel = new UserModel();
    let password = Md5.hashStr(userData.password);
    userModel.getUserByEmailAndPassword(userData.email, password)
    .then((rowsData) => {
      if(rowsData && rowsData.length === 1) {
        let user = rowsData[0];
        let tokenGenerated = jwt.sign({
          email: user.usr_email, fullName: user.usr_name, id: user.usr_id}, 
          config.envConfig.secretKey,
          { expiresIn: '24h' }
        );
        nextSuccess({token: tokenGenerated});
      } else {
        nextError({
          code: 10,
          error: "User not found"
        });
      }
    }).catch((error) => {
      console.error(error);
      nextError({
        code: 11,
        error: error.sqlMessage
      });
    });
  }

  public sendNewPassword(email, nextSuccess, nextError) {
    let userModel = new UserModel();
    userModel.getUserByEmail(email).then(
      (rowData) => {
        if(rowData && rowData.length > 0) {
          const userData = rowData[0];
          this.sendEmailPasswordReset(userData, nextSuccess, nextError);
        } else {
          nextError({
            code: 10,
            error: "User not found",
          });
        }
      }
    ).catch(
      error => {
        console.error(error);
        nextError({
          code: 11,
          error: error.sqlMessage,
        });
      }
    );
  }

  private sendEmailPasswordReset(userData, nextSuccess, nextError) {
    const randomPassword = Math.random()*1500000 + 'AAD362C7D7E2123D4D7E8E302E43047B';
    const newPassword: string = Md5.hashStr(randomPassword).toString();
    const transporter = nodemailer.createTransport({
      service: config.envConfig.emailData.service, //'Gmail',
      auth: {
        user: config.envConfig.emailData.user,
        pass: config.envConfig.emailData.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const mailOptions = {
      from: config.envConfig.emailData.from,
      to: userData.usr_email,
      subject: '[Chiaraviglio Hnos Web] Nueva password',
      text: `Esta es la nueva password generada: ${randomPassword}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        nextError({
          id: '15',
          error: 'Error sending reset password email',
        })
      } else {
        new UserModel().updatePassword(userData.usr_id, Md5.hashStr(newPassword).toString())
        .then(() => {
          nextSuccess({
            message: 'La constraseña fue enviada con exito',
          });
        }, (errorResponse) => {
          console.error(errorResponse);
          nextError({
            code: 14,
            error: errorResponse.sqlMessage,
          });
        });
      }
    });
  }

  private isUserCreateDataValid(body) {
    let error = null;
    if (!body.name) {
      error = {
        code: 1,
        error: "Name is required",
      };
    } else if (!body.email) {
      error = {
        code: 2,
        error: "Email is required",
      };
    } else if (!body.password) {
      error = {
        code: 3,
        error: "Password is required",
      };
    } else if (!body.idNumber) {
      error = {
        code: 4,
        error: "Id Number is required(e.g: cuit)",
      };
    }
    return error;
  }
}