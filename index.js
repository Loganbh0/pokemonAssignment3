require('dotenv').config();
const express = require("express");
const knex = require("knex");

const app = express();
app.set("view engine", "ejs");
const port = process.env.PORT;

const db = knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    },
});

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    db.select("*")
        .from("pokemon")
        .orderBy("description")
        .then(pokemon => res.render("displayPokemon", { pokemonList: pokemon, error_message: "" }))
        .catch(err => {
            console.error(err);
            res.render("displayPokemon", { pokemonList: [], error_message: "Database error." });
        });
});

app.post("/searchPokemon", (req, res) => {
    const name = req.body.name;
    db.select("*")
        .from("pokemon")
        .whereILike("description", name)
        .then(rows => {
            if (rows.length > 0) res.render("searchResult", { pokemon: rows[0] });
            else res.render("searchResult", { pokemon: null });
        })
        .catch(err => {
            console.error(err);
            res.render("searchResult", { pokemon: null, error_message: "Search failed." });
        });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
