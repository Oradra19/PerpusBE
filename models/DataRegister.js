import db from "../db/config.js";

const Register = {
  async create(name,  username, email, password) {
    const [rows] = await db.execute(
      "INSERT INTO admins (name,  username, email, password) VALUES (?, ?, ?, ?)",
      [name,  username, email, password]
    );
    return rows.insertId; 
  },

  async findByusername(username) {
    const [rows] = await db.execute("SELECT * FROM admins WHERE username = ?", [username]);
    return rows[0]; 
  }

  
};

export default Register;
