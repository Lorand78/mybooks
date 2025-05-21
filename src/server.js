import express, { json } from 'express';
import cors from 'cors';  // CORS csomag importálása
import { createConnection } from 'mysql2';
const app = express();
const port = 3000;

// CORS engedélyezése minden API kéréshez
app.use(cors());  // Itt engedélyezzük a CORS-t

// Middleware a JSON kérések feldolgozásához
app.use(json());

//MySql kapcsolat
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Lorci/1978_mysql',
  database: 'mybooks'
};

const connection = createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('MySQL cssatlakozási hiba:', err);
    return;
  }
  console.log('Csatlakozás a MySQL adatbázishoz sikeres!');
})

// API endpoint az adatok lekérdezésére
app.get('/api/data/:cat/:id/:user', async (req, res) => {
  var query = '';
  var where = '';
  switch (req.params.cat) {
    case 'AT': 
      if (req.params.id != -1) {
        where = 'WHERE AT_ID = ' + req.params.id;
      }
      query = 'SELECT a.*, n.* FROM mybooks.AUTHOR a LEFT JOIN mybooks.NATIONALITY n ON NN_ID = AT_NN_ID ' + where + ' ORDER BY AT_AUTHORNAME';
      // query = 'SELECT * FROM AUTHOR ' + where + ' ORDER BY AT_AUTHORNAME';
      console.log("author: " + query);
      break;
    case 'ATCNT':
      query = 'SELECT COUNT(*) FROM mybooks.BOOK WHERE BK_AT = ' + req.params.id
      console.log("author count: " + query)
      break;
    case 'CG': 
      if (req.params.id != -1) {
        where = 'WHERE CG_ID = ' + req.params.id;
      }
      query = 'SELECT * FROM CATEGORY ' + where;
      console.log("category: " + query)
      break
    case 'BT': 
      if (req.params.id != -1) {
        where = 'WHERE BT_ID = ' + req.params.id;
      }
      query = 'SELECT * FROM BOOKTYPE ' + where;
      console.log(" booktype: " + query)
      break
    case 'OS': 
      if (req.params.id != -1) {
        where = 'WHERE OS_ID = ' + req.params.id;
      }
      query = 'SELECT * FROM OWNERSHIP_STATUS ' + where;
      console.log("osstatus: ", query)
      break
    case 'PS': 
      if (req.params.id != -1) {
        where = 'WHERE PS_ID = ' + req.params.id;
      }
      query = 'SELECT * FROM PUBLISHER ' + where;
      console.log("publisher: ", query)
      break
    case 'NN': 
      if (req.params.id != -1) {
        where = 'WHERE NN_ID = ' + req.params.id;
      }
      query = 'SELECT * FROM NATIONALITY ' + where;
      console.log("nationality: ", query)
      break
    case 'BK': 
      if (req.params.id != -1) {
        query = 'SELECT * FROM `BOOK` WHERE BK_ID =  ' + req.params.id;
      } 
      else {
        query = 'SELECT BK_ID, BK_BOOKTITLE, BK_READED, BK_DESCRIPTION, AT_AUTHORNAME, BT_TYPENAME, CG_CATEGORY, OS_NAME, PS_PUBLISHERNAME ' +
                  'FROM BOOK LEFT JOIN PUBLISHER ON BOOK.BK_PS_ID = PUBLISHER.PS_ID ' + 
                       'LEFT JOIN OWNERSHIP_STATUS ON BOOK.BK_OS_ID = OWNERSHIP_STATUS.OS_ID, ' + 
                       'AUTHOR, BOOKTYPE, CATEGORY ' +
                 'WHERE AT_ID = BK_AT ' +
                   'AND BT_ID = BK_BT ' +
                   'AND CG_ID = BK_CG_ID ' +
                   'AND BK_USER = "' + req.params.user + '"';
      }
      console.log("publisher: ", query)
      break
  };
  // const query = 'SELECT * FROM AUTHOR ORDER BY AT_AUTHORNAME';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Hiba a lekérdezés során:', err);
      res.status(500).send('Adatbázis hiba');
    } else {
      res.json(results);
    }
  });
});
  
app.get('/api/data/login/US/:username/:password', async (req, res) => {
  const query = 'SELECT * FROM USERS WHERE US_USERNAME = "' + req.params.username + '"' + ' AND US_PASSWORD = SHA2("' + req.params.password + '", 256)'; 
  console.log('query: ' + query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Hiba a lekérdezés során:', err);
      res.status(500).send('Adatbázis hiba');
    } else {
      res.json(results);
    }
  });
});
  
// API endpoint a book adatok felírásához
app.post('/book', (req, res) => {
  console.log('post: ', req.body);
  const query = req.body.query
  console.log('query: ', query);
  connection.query(query, (err, result) => {
      if (err) {
          console.error('Hiba az adatok beillesztésekor:', err);
          res.status(500).json({ error: 'Adatbeillesztési hiba.' });
      } else {
          res.status(200).json({ message: 'Sikeresen hozzáadva!', userId: result.insertId });
      }
  });
});

// API endpoint az adatok felírásához
app.post('/add/:cat', (req, res) => {
  console.log('add post: ', req.body);
  const { name } = req.body; // Az adatok lekérése a kérésből
  var query = '';
  switch (req.params.cat) {
    case 'AT':
      query = "INSERT INTO AUTHOR (AT_AUTHORNAME, AT_NN_ID) VALUES ('" + req.body.name + "', " + req.body.nationalityid + ")"
      break
    case 'CG':
      query = "INSERT INTO CATEGORY (CG_CATEGORY) VALUES ('" + req.body.name + "')"      
      break
    case 'BT':
      query = "INSERT INTO BOOKTYPE (BT_TYPENAME) VALUES ('" + req.body.name + "')"   
      break
    case 'OS':
      query = "INSERT INTO OWNERSHIP_STATUS (OS_NAME) VALUES ('" + req.body.name + "')"
      break
    case 'PS':
      query = "INSERT INTO PUBLISHER (PS_PUBLISHERNAME) VALUES ('" + req.body.name + "')"
      break
                      
    default:
      break
  }
  console.log("add query: ", query)

  connection.query(query, [name], (err, result) => {
      if (err) {
          console.error('Hiba az adatok beillesztésekor:', err);
          res.status(500).json({ error: 'Adatbeillesztési hiba.' });
      } else {
          res.status(200).json({ message: 'Sikeresen hozzáadva!', userId: result.insertId });
      }
  });
});

// API endpoint az adatok módosításához
app.post('/upd/:cat', (req, res) => {
  console.log('upd post: ', req.body);
  const { name } = req.body; // Az adatok lekérése a kérésből
  console.log("name: ", req.body.name)
  var query = '';
  var nationalitytxt = ''
  switch (req.params.cat) {
    case 'AT':
      req.body.nationalityid ? nationalitytxt = ', AT_NN_ID = ' + req.body.nationalityid : null
      query = "UPDATE AUTHOR SET AT_AUTHORNAME = '" + req.body.name + "'" + nationalitytxt + ' WHERE AT_ID = ' + req.body.id;
      break
    case 'CG':
      query = "UPDATE CATEGORY SET CG_CATEGORY = '" + req.body.name + "'" + ' WHERE CG_ID = ' + req.body.id;      
      break
    case 'BT':
      query = "UPDATE BOOKTYPE SET BT_TYPENAME = '" + req.body.name + "'" + ' WHERE BT_ID = ' + req.body.id;      
      break
    case 'OS':
      query = "UPDATE OWNERSHIP_STATUS SET OS_NAME = '" + req.body.name + "'" + ' WHERE OS_ID = ' + req.body.id;
      break
    case 'PS':
      query = "UPDATE PUBLISHER SET PS_PUBLISHERNAME = '" + req.body.name + "'" + ' WHERE PS_ID = ' + req.body.id;
      break
                      
    default:
      break
  }
  console.log("query: ", query)
  connection.query(query, [name], (err, result) => {
      if (err) {
          console.error('Hiba az adatok beillesztésekor:', err);
          res.status(500).json({ error: 'Adatbeillesztési hiba.' });
      } else {
          res.status(200).json({ message: 'Sikeresen hozzáadva!', userId: result.insertId });
      }
  });
});

// API endpoint az adatok törléséhez
app.post('/del/:cat', async (req, res) => {
  console.log('del post: ', req.body)
  const { id } = req.body // Az adatok lekérése a kérésből
  var chkquery = ''
  var query = ''
  var cnt = -1
  switch (req.params.cat) {
    case 'BK':
      query = 'DELETE FROM BOOK WHERE BK_ID = ' + req.body.id      
      break
    case 'AT':
      chkquery = 'SELECT COUNT(*) cnt FROM BOOK WHERE BK_AT = ' + req.body.id
      query = 'DELETE FROM AUTHOR WHERE AT_ID = ' + req.body.id
      break
    case 'CG':
      chkquery = 'SELECT COUNT(*) cnt FROM BOOK WHERE BK_CG_ID = ' + req.body.id
      query = 'DELETE FROM CATEGORY WHERE CG_ID = ' + req.body.id
      break
    case 'BT':
      chkquery = 'SELECT COUNT(*) cnt FROM BOOK WHERE BK_BT = ' + req.body.id
      query = 'DELETE FROM BOOKTYPE WHERE BT_ID = ' + req.body.id
      break
    case 'OS':
      chkquery = 'SELECT COUNT(*) cnt FROM BOOK WHERE BK_OS_ID = ' + req.body.id
      query = 'DELETE FROM OWNERSHIP_STATUS WHERE OS_ID = ' + req.body.id
      break
    case 'PS':
      chkquery = 'SELECT COUNT(*) cnt FROM BOOK WHERE BK_PS_ID = ' + req.body.id
      query = 'DELETE FROM PUBLISHER WHERE PS_ID = ' + req.body.id
      break                    
    default:
      break
  }

  if (req.params.cat == 'BK') {
    connection.query(query, [id], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Adattörlési hiba.' })
      } else {
          return res.status(200).json({ message: 'Sikeresen törölve!', userId: result.insertId })
      }
    });
  } else {
    connection.query(chkquery, [id], (err, result) => {
      console.log('result: ', result)
      if (err) {
          return res.status(500).json({ error: 'Adattörlési hiba.' })
      } else {
        cnt = result[0].cnt
        if (cnt > 0) {
          return res.status(400).json({ message: 'Nem törölhető, mert van hozzárendelve könyv!' })
        } else {
          connection.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Adattörlési hiba.' })
            } else {
                return res.status(200).json({ message: 'Sikeresen törölve!', userId: result.insertId })
            }
          })
        }
      }
    })
  }
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a http://localhost:${port} címen`);
  // mysql.query('select * from author', (err, results) => {
  //   if (err) throw err;
  //   console.log(results);
  // });
});

//const { createConnection } = require('mysql2');

// const connection = createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Lorci/1978_mysql',
//     database: 'mybooks'
//   });

//   connection.connect((err) => {
//     if (err) throw err;
//     console.log('Kapcsolódva az adatbázishoz')
//   });
  
//   connection.query('select * from author', (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });

//   module.exports = connection;
  //connection.end();