const { pool } = require('../db/db');

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
    const { id_estado, id_rol, correo, contrasena } = req.body;

    const query = 'SELECT COUNT(*) AS count FROM sac.usuario WHERE correo = $1';
    const { rows } = await pool.query(query, [correo]);
    const count = rows[0].count;
    if (count > 0) {
      return res.status(400).send({
        success: false,
        message: 'El correo ingresado ya existe',
      });
    }

    const insertQuery = 'INSERT INTO sac.usuario (id_estado, id_rol, correo, contrasena, created_at) VALUES ($1, $2, $3,$4,  NOW())';
    await pool.query(insertQuery, [id_estado, id_rol, correo, contrasena]);

    return res.status(200).send({
      success: true,
      message: 'Usuario insertado con éxito',
    });
  } catch (error) {
    console.error('Error al insertar usuario', error);
    res.status(500).send('Error en el servidor');
  }
};