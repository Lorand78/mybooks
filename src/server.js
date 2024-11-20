const express = require('express');
const cors = require('cors');  // CORS csomag importálása
const mysql = require('mysql2');
const app = express();
const port = 3000;

// CORS engedélyezése minden API kéréshez
app.use(cors());  // Itt engedélyezzük a CORS-t

// Middleware a JSON kérések feldolgozásához
app.use(express.json());

//MySql kapcsolat
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Lorci/1978_mysql',
  database: 'mybooks'
};

const connection = mysql.createConnection(dbConfig);

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
      query = 'SELECT * FROM AUTHOR ' + where + ' ORDER BY AT_AUTHORNAME';
      console.log("author: " + query);
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
    case 'BK': 
      if (req.params.id != -1) {
        query = 'SELECT * FROM `BOOK` WHERE BK_ID =  ' + req.params.id;
      } 
      else {
        query = 'SELECT BK_ID, BK_BOOKTITLE, BK_READED, AT_AUTHORNAME, BT_TYPENAME, CG_CATEGORY, OS_NAME, PS_PUBLISHERNAME ' +
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

// API endpoint a publisher adatok felírásához
app.post('/add/:cat', (req, res) => {
  console.log('post: ', req.body);
  const { name } = req.body; // Az adatok lekérése a kérésből
  var query = '';
  if (req.params.cat == 'AT') {
    query = 'INSERT INTO AUTHOR (AT_AUTHORNAME) VALUES (?)';
  } else {
    query = 'INSERT INTO PUBLISHER (PS_PUBLISHERNAME) VALUES (?)';
  }
  connection.query(query, [name], (err, result) => {
      if (err) {
          console.error('Hiba az adatok beillesztésekor:', err);
          res.status(500).json({ error: 'Adatbeillesztési hiba.' });
      } else {
          res.status(200).json({ message: 'Sikeresen hozzáadva!', userId: result.insertId });
      }
  });
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