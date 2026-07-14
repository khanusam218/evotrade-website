const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/', require('./routes/index'));

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found — Evotrade' });
});

app.listen(PORT, () => {
  console.log(`Evotrade site running at http://localhost:${PORT}`);
});
