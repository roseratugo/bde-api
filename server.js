const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

let db = new sqlite3.Database('./bde_projects.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connecté à la base de données SQLite.');
});

// Création de la table Projects si elle n'existe pas déjà
db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    image TEXT,
    classname TEXT
)`);

// Middleware pour parser le corps des requêtes POST en JSON
app.use(express.json());
app.use(cors());

// Route pour récupérer les projets
app.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if (err) {
            res.status(400).send("Erreur lors de la récupération des projets");
            return console.error(err.message);
        }
        res.json(rows);
    });
});

// Route pour ajouter un nouveau projet
app.post('/projects', async (req, res) => {
    const { url, image, title, description, name, classname  } = req.body;

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        db.run(`INSERT INTO projects (name, url, title, description, image, classname) VALUES (?, ?, ?, ?, ?, ?)`, [name, url, title, description, image, classname], function(err) {
            if (err) {
                res.status(400).send("Erreur lors de l'ajout du projet");
                console.error(err.message);
            } else {
                res.json({ message: "Projet ajouté avec succès", name, url, title, description, image });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des métadonnées', error);
        res.status(500).send("Erreur lors de la récupération des métadonnées");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
