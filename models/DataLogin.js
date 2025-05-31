import db from "../db/config.js";

const Pengguna = {
  async findOneByusername(username) {
    if (!username) {
      throw new Error("Username tidak boleh kosong atau undefined");
    }
    const [rows] = await db.execute("SELECT * FROM pengguna WHERE username = ?", [username]);
    return rows[0]; 
  },
};

export default Pengguna;
