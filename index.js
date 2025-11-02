import cors from "cors";
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'; 
import loginRoutes from './routes/Login.js';
import registerRoutes from './routes/Register.js';
import barangRoutes from './routes/Barang.js';
import DashboardRoute from "./routes/Dashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;


app.use(cookieParser());
app.use(express.json());  
app.use(express.urlencoded({ extended: false })); 

// app.use(cors({
//   origin: 'http://localhost:5173', 
//   methods: 'GET,POST,PUT,DELETE',
//   credentials: true
// }));

//sementara
const corsOptions = {
  origin: '*',  
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use('/api/',       loginRoutes);
app.use('/api/',       registerRoutes);
app.use('/api/barang', barangRoutes);
app.use("/api/dashboard", DashboardRoute);



app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
