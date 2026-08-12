require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db/database");
const troupesRoutes = require("./routes/troupes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/troupes", troupesRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend L’ImprOse opérationnel"
    });
});

pool.connect()
    .then((client) => {
        console.log("Connexion à PostgreSQL réussie");
        client.release();

        app.listen(PORT, () => {
            console.log(`Backend démarré sur http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "Impossible de se connecter à PostgreSQL :",
            error.message
        );
    });