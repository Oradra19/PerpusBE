import db from "../db/config.js";

const Register = {
  async create(name,  username, Password) {
    const [rows] = await db.execute(
      "INSERT INTO admins (name,  username, username, Password) VALUES (?, ?, ?, ?)",
      [name,  username, Password]
    );
    return rows.insertId; 
  },

  async findByusername(username) {
    const [rows] = await db.execute("SELECT * FROM admins WHERE username = ?", [username]);
    return rows[0]; 
  }

  
};

export default Register;
