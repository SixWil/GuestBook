import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import { Console } from 'console';

const app = express();
const port = 3000;

const db = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GuestBook',
    password: 'OgreMail',
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const result = await db.query('SELECT * FROM guestbook');

    res.render('index.ejs', {guestbook: result.rows});
    console.log(result.rows);
});

app.get('/admin', async (req, res) => {
    const result = await db.query('SELECT * FROM guestbook');

    res.render('admin.ejs', {guestbook: result.rows});
})

app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;

    await db.query('DELETE FROM guestbook WHERE id = $1', [id]);

    res.redirect('/admin');
})

app.post('/add', async (req, res) => {
    const name = req.body.name;
    const message = req.body.message;

    await db.query('INSERT INTO guestbook (namn, meddelande) VALUES ($1, $2)', [name, message]);

    res.redirect('/');

    console.log(name, message);
})

app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const newMessage = req.body.newMessage;

    await db.query('UPDATE guestbook SET meddelande = $1 WHERE id = $2', [newMessage, id]);

    res.redirect('/admin');
});

app.get('/login', async (req, res) => {
    res.render('login.ejs', {fel_meddelande: null});
})

app.post('/login', async (req, res) => {
    const admin_name = req.body.admin_name;
    const password = req.body.password;

    if (admin_name === 'Ogre' && password === 'Mail') {
        res.redirect('/admin');
    } else {
        let fel = "Nae,";
        res.render('login.ejs', {fel_meddelande: fel});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
