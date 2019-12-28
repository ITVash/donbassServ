import * as jwt from 'jsonwebtoken';

interface authData { 
  login: String;
  firstName: String;
  lastName: String;
  access: Number;
  smena: Number;
}
const config = "a1497407768d8b4a5c9284e0e99a3ce7bfaf9847ab94432553f8a21453d1176322b47b082546703f19d5195fe90f44528cf2703f895f3d0ddfd32b08693842cc"; 
export default (user: authData) => {
  const token = jwt.sign({
    user
  }, config, { expiresIn: 604800 });
  return token;
}