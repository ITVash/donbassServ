import * as express from 'express'
import * as webpush from 'web-push'

import { db } from './../utils';

class Notifications {
  create = (req: express.Request, res: express.Response) => {
    const subscription = req.body
    const auth = subscription.keys.auth

    db.doc(`/notification/${auth}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return res.status(200).json({message:`Пользователь ${auth} уже есть в базе данных`})
        } else {
          return doc
        }
      })
      .then(() => {
        return db.doc(`/notification/${auth}`).set(subscription)
      })
      .then(() => {
        res.status(201).json({message: `Пользователь ${auth} добавлен в базу данных`})
      })
      .catch(err => {
        return res.status(500).json({message:'Ошибка добавления!!!', error: err})
      })
  }
  sendAll = (req: express.Request, res: express.Response) => {
    const subject = JSON.stringify({
      'title': req.body.title,
      'body': req.body.body
    })
    const users: { endpoint: string; keys:{p256dh: string; auth: string; } }[]  = []
    db.collection('notification')
      .get()
      .then(doc => {
        doc.forEach(data => {
          users.push({
            endpoint: data.data().endpoint,
            keys: {
              p256dh: data.data().keys.p256dh,
              auth: data.data().keys.auth
            }
          })          
        })
        //webpush.sendNotification(users, subject)
        //res.json({message:`Собран массив пользователей для рассылки`, data:users})
        return users
      })
      .then(data => {
        data.forEach(user => {
          webpush.sendNotification(user, subject)
            .then(result => console.log(result))
            .catch(e => console.log(e.stack))
        })
        res.status(200).json({message:`Сообщения отправленны`})
      })
      .catch(err => {
        return res.status(500).json({message:`Не удалось получить данные пользователей рассылки`, error: err})
      })
  }
}

export default Notifications