const bcrypt = require('bcrypt');
const { pool } = require('../db/db');
const saltRounds = 10;


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

exports.createUser = async (req, res) => {
  try {
    const newUser = req.body;
    console.log(newUser);

    if (!newUser.correo || !newUser.contrasena) {
      throw new Error("Ingrese su correo y contraseña");
    }
    //Encontrar la ID mayor y sumar 1 para crear un nuevo usuario.
    
    const hashedPassword = await bcrypt.hash(newUser.contrasena, saltRounds);

    const query = 'INSERT INTO usuario (id, correo, contrasena) VALUES ($1, $2, $3)';
    const values = [newUser.id, newUser.correo, hashedPassword];
    console.log('values:', values)

    await pool.query(query, values);
    console.log(`Usuario creado con éxito`);

    return res.status(200).send({
      success: true,
      message: "usuario creado"
    });
  } catch (error) {
    console.error('Error al crear usuario', error);
    res.status(500).send('Error en el servidor');
  }
};


async function login(correo, contrasena) {    //add "sac." a usuario para BD cloud
  const query = {
    text: `SELECT correo, contrasena 
           FROM usuario   
           WHERE correo = $1 
           AND contrasena = $2`,
    values: [correo, contrasena],
  };

  const { rows } = await pool.query(query);

  if (rows.length === 0) {
    return { success: false };
  }

  return { success: true };
}

exports.loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      throw new Error("Ingrese su correo y contraseña")
    }
    const resultado = await login(correo, contrasena);

    if (resultado.success) {
      return res.status(200).send({
        success: true,
        message: "Inicio de sesión exitoso",
        Data: resultado
      })
    } else {
      return res.status(401).send({
        success: false,
        message: "Correo o contraseña incorrectos"
      })
    }

  } catch (error) {
    console.error('Error al comprobar las credenciales', error);
    res.status(500).send('Error en el servidor');
  }
};

