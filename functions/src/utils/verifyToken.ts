import * as jwt from 'jsonwebtoken';
import * as express from 'express';

const config = "a1497407768d8b4a5c9284e0e99a3ce7bfaf9847ab94432553f8a21453d1176322b47b082546703f19d5195fe90f44528cf2703f895f3d0ddfd32b08693842cc";
export default (req: express.Request, res: express.Response, next:express.NextFunction) => { 
  let idToken: string;
  if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
    jwt.verify(idToken, config, (err, decodeJWT) => { 
      if (err || !decodeJWT) {
        res.status(403).json({message: `Ой ой ой, а токен та не настоящий!`})
      } else {
        //res.status(200).json(decodeJWT);
        //req.user = decodeJWT;
        next();
      }
    });
  } else {
    console.error('Токен не найден!');
    return res.status(403).json({ error: 'Вы не авторизованы!' });
  }
  /*new Promise((resolve:any, reject:any) => {
    jwt.verify(idToken, config || '', (err:any, decodeJWT:any) => { 
      if (err || !decodeJWT) {
        return res.status(403).json(reject(err));
      }
      resolve(decodeJWT);
      return; 
    });
  });*/
  return;
};
/*export default (token: string) =>
  new Promise((resolve:any, reject:any) => {
    jwt.verify(token, config || '', (err, decodeJWT) => {
      if (err || !decodeJWT) {
        return reject(err);
      }
      resolve(decodeJWT);
    });
  });*/
