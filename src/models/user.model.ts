import * as connections from '../config/connection';

const INSERT_QUERY = "INSERT INTO users(usr_name, usr_email, usr_id_number, usr_password, usr_account_number) VALUES(?,?,?,?,?)";
const UPDATE_PASSWORD_QUERY = 'UPDATE users set usr_password=? WHERE usr_id = ?';
const UPDATE_QUERY = "UPDATE users set usr_name=?, usr_id_number=? WHERE usr_id = ?";
const SELECT_ID_QUERY = `SELECT usr.usr_id, usr.usr_name, usr.usr_email, usr.usr_id_number, usr.usr_account_number
                         FROM users usr WHERE usr.usr_id = ?`;
const SELECT_EMAIL_QUERY = `SELECT usr.usr_id, usr.usr_name, usr.usr_email, usr.usr_id_number, usr.usr_account_number
                            FROM users usr WHERE usr.usr_email LIKE ?`;
const SELECT_EMAIL_PASSWD_QUERY = `SELECT usr.usr_id, usr.usr_name, usr.usr_email, usr.usr_id_number, usr.usr_account_number
                                   FROM users usr WHERE usr.usr_email LIKE ? AND usr.usr_password LIKE ?`;

export default class UserModel {

  public createUser(name, email, idNumber, password, accountNumber) {
    let emailToSave = email ? email.toLowerCase() : null;
    //idNumber is a cuit
    return connections.db.query(INSERT_QUERY, [name, emailToSave, idNumber, password, accountNumber]);
  }

  public updateUser(id, name, idNumber) {
    return connections.db.query(UPDATE_QUERY, [name, idNumber, id]);
  }

  public updatePassword(id, password) {
    return connections.db.query(UPDATE_PASSWORD_QUERY, [password, id]);
  }

  public getUserById(id) {
    return connections.db.query(SELECT_ID_QUERY, [id]);
  }

  public getUserByEmail(email) {
    let emailToSearch = email ? email.toLowerCase() : null;
    return connections.db.query(SELECT_EMAIL_QUERY, [emailToSearch]);
  }

  public getUserByEmailAndPassword(email, password) {
    let emailToSearch = email ? email.toLowerCase() : null;
    return connections.db.query(SELECT_EMAIL_PASSWD_QUERY, [emailToSearch.toLowerCase(), password]);
  }
}