const { pool } = require('../db/db');
const bcrypt = require('bcrypt');

exports.getUser = async (req, res) => {
  try {
    const query = 'SELECT * FROM sac.usuario';
    const result = await pool.query(query);

    console.log("BD DATA: ", result.rows)

    return res.status(200).send({
      success: true,
      message: "usuario encontrado",
      Data: result.rows
    })

  } catch (error) {
    console.error('Error al obtener los usuarios', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.addUser = async (req, res) => {
  try {
    const { id_rol, correo, contrasena } = req.body;

    // Verifica si el correo ya existe en la tabla de usuario
    const query = 'SELECT COUNT(*) AS count FROM sac.usuario WHERE correo = $1';
    const { rows } = await pool.query(query, [correo]);
    const count = rows[0].count;
    if (count > 0) {
      return res.status(400).send({
        success: false,
        message: 'El correo ingresado ya existe',
      });
    }

    // Encriptación de la password
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    //establece siempre id_estado en 1, es decir, como activo
    //la fecha se establece siempre como la fecha actual
    const insertQuery = 'INSERT INTO sac.usuario (id_estado, id_rol, correo, contrasena, created_at) VALUES (1, $1, $2, $3, NOW())';
    await pool.query(insertQuery, [id_rol, correo, hashedPassword]);

    return res.status(200).send({
      success: true,
      message: 'Usuario insertado con éxito',
    });
  } catch (error) {
    console.error('Error al insertar usuario', error);
    res.status(500).send('Error en el servidor');
  }
};