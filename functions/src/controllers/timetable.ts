import * as express from 'express';
import { db } from './../utils';

class TimeTable {
  create = (req: express.Request, res: express.Response) => {
    const date = new Date();
    const data = {
      items: req.body
    };
    const dateFF: String = `${date.getDate()+1}.${date.getMonth()}.${date.getFullYear()}`;
    //return res.json({ Item: req.body.items, dateF:dateFF });
    db.doc(`/timetable/${dateFF}`).set(data.items)
      .then(() => {
        return db.doc(`/timetable/${dateFF}`).get();
      })
      .then(doc => {
        res.status(201).json({ message: 'Данные успешно внесены в базу данных!', doc });
      })
      .catch(err => { 
        res.status(500).json({ message: `Ошибка добавления графика: ${err}` });
      });
  };
  snow = (_: any, res: express.Response) => {     
    db.collection('/timetable')
      .get()
      .then(doc => {
        const data:any = [];
        doc.forEach(item => {
          data.push(item.data());
        });
        res.status(200).json(data);
      })
      .catch(err => { 
        res.status(500).json({ message: `Ошибка отображения: ${err}` });
      });
  };
  showPeriod = (req: express.Request, res: express.Response) => { return true};
  update = (req: express.Request, res: express.Response) => { return true};
  delete = (req: express.Request, res: express.Response) => { return true};
};

export default TimeTable;