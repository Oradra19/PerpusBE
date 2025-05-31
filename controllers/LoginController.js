import db from "../db/config.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM admins WHERE username = ?";
    const [results] = await db.execute(query, [username]);

    if (results.length === 0) {
      return res.status(401).json({ error: "username tidak ditemukan" });
    }

    const admin = results[0];

    const isValid = bcrypt.compareSync(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: "Password salah" });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, "secretKey", {
      expiresIn: "1d",
    });

    res.json({ message: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server", details: error.message });
  }
};
