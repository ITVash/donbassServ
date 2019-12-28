//import * as firebase from 'firebase';
import * as express from 'express';

import { db, createJWT } from './../utils';

class Auth {
  create = (req: express.Request, res: express.Response) => {
    const userData = {
      login: req.body.login,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      password: req.body.password,
      access: req.body.access,
      smena: req.body.smena
    };
    db.doc(`/user/${userData.login}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return res.status(400).json({ message: `Пользователь ${userData.login} уже зарегистрирован!` });
        } else {
          return doc;
        }
      })
      .then( () => {
        const withCredential = {
          login: userData.login,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          password: userData.password,
          access: userData.access,
          smena: userData.smena,
          createAt: new Date().toJSON(),
          updateAt: new Date().toJSON()
        };
        return db.doc(`/user/${userData.login}`).set(withCredential);
      })
      .then(() => {
        const user = {
          login: userData.login,
          firstName: userData.firstName,
          lastName: userData.lastName,
          access: userData.access,
          smena: userData.smena
        }
        const token = createJWT(user);
        return res.status(201).json({message: `Пользователь ${userData.login} добавлен в систему!`, token});
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ message: 'Ошибка при добавлении нового пользователя, попробуйте еще раз!!!'});
      });
  };
  show = (req: express.Request, res: express.Response) => {
    const user = req.body.login;
    db.collection(`user`)
      .where('login','==',user)
      .get()
      .then(doc => {
        const userData:any = [];
        doc.forEach(data => { 
          userData.push({
            login: data.data().login,
            firstName: data.data().firstName,
            lastName: data.data().lastName,
            access: data.data().access,
            smena: data.data().smena
          });
        });
        const token = createJWT(userData);
        const added = userData[0];
        added.token = token;
        return res.status(200).json( added );
      })
      .catch(err => { 
        console.error(`Ошибка: ${err}`);
        res.status(500).json({ error: `Пользователь не найден: ${err.code}` });
      });
  };
  info = (req: express.Request, res: express.Response) => { 
    db.doc(`/user/${req.params.login}`)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return res.status(403).json({message: `А пользователя то и нет!!!`});
        }
        return doc.data();
      })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(`Ошибка: ${err}`);
        res.status(500).json({ error: `Пользователь не найден: ${err.code}` });
      });
  };
}
export default Auth;