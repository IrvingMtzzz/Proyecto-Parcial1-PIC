import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

app.get("/", (req, res) => {
    res.send("Bienvenidos a mi API");
});

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_eventos',
    port: 3306
};

let db;
const initDbConnection = async () => {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error("Error al conectar la base de datos:", error);
        process.exit(1); 
    }
};
initDbConnection();


app.get('/actividades/', async (req, res) => {
    const query = "SELECT * FROM actividades";
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener actividades:", error);
        res.status(500).send("Error al ejecutar la consulta");
    }
});

app.delete("/actividades/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM actividades WHERE id_actividad = ?";
    try {
        const [result] = await db.execute(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).send("Actividad no encontrada");
        } else {
            res.status(200).json("Actividad eliminada exitosamente");
        }
    } catch (error) {
        console.error("Error al eliminar actividad:", error);
        res.status(500).send("Error al ejecutar la consulta");
    }
});

app.post("/actividades/", async (req, res) => {
    const { nombre_actividad, descripcion } = req.body;
    const query = "INSERT INTO actividades (nombre_actividad, descripcion) VALUES (?, ?)";
    try {
        const [result] = await db.execute(query, [nombre_actividad, descripcion]);
        res.status(201).json("Actividad registrada exitosamente");
    } catch (error) {
        console.error("Error al registrar actividad:", error);
        res.status(500).send("Error al ejecutar la consulta");
    }
});


app.put('/actividades/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_actividad, descripcion } = req.body; 

    const query = `
        UPDATE actividades 
        SET nombre_actividad = ?, descripcion = ?
        WHERE id_actividad = ?`;

    try {
        const [result] = await db.execute(query, [nombre_actividad, descripcion, id]);

        if (result.affectedRows === 0) {
            res.status(404).send('No existe la actividad');
        } else {
            res.status(200).json('Actividad actualizada exitosamente');
        }
    } catch (error) {
        console.error('Error al actualizar la actividad:', error);
        res.status(500).send('Error al actualizar la actividad');
    }
});



app.get('/participantes/', async (req, res) => {
    const query = "SELECT * FROM participantes";
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener participantes:", error);
        res.status(500).send("Error al ejecutar la consulta");
    }
});

app.post("/participantes/", async (req, res) => {
    const { nombre, edad, email } = req.body;
    const query = "INSERT INTO participantes (nombre, edad, email) VALUES (?, ?, ?)";
    try {
        const [result] = await db.execute(query, [nombre, edad, email]);
        res.status(201).json("Participante registrado exitosamente");
    } catch (error) {
        console.error("Error al registrar participante:", error);
        res.status(500).send("Error al ejecutar la consulta");
    }
});

app.put('/participantes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, edad, email } = req.body;

    const query = `
        UPDATE participantes
        SET nombre = ?, edad = ?, email = ?
        WHERE id_participante = ?`;

    try {
        const [result] = await db.execute(query, [nombre, edad, email, id]);

        if (result.affectedRows === 0) {
            res.status(404).send('Participante no encontrado');
        } else {
            res.status(200).json('Participante actualizado exitosamente');
        }
    } catch (error) {
        console.error('Error al actualizar participante:', error);
        res.status(500).send('Error al actualizar participante');
    }
});


app.delete("/participantes/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM participantes WHERE id_participante = ?";
    try {
        const [result] = await db.execute(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).send("Participante no encontrado");
        } else {
            res.status(200).json("Participante eliminado exitosamente");
        }
    } catch (error) {
        console.error("Error al eliminar participante:", error);
        res.status(500).send("Error al ejecutar la consulta");
    }
});

app.get('/inscripciones', async (req, res) => {
    const query = `
        SELECT 
            i.id_participante,
            p.nombre AS nombre_participante,
            i.id_actividad,
            a.nombre_actividad
        FROM 
            inscripciones i
        INNER JOIN 
            participantes p ON i.id_participante = p.id_participante
        INNER JOIN 
            actividades a ON i.id_actividad = a.id_actividad;
    `;
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default app;
