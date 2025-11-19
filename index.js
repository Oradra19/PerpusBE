import cors from "cors";
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'; 
import loginRoutes from './routes/Login.js';
import registerRoutes from './routes/Register.js';
import barangRoutes from './routes/Barang.js';
import DashboardRoute from "./routes/Dashboard.js";
import VisitorRoute from "./routes/VisitorStats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==============================
//          FIX CORS
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  "https://ketemuin.vercel.app"  // GANTI DENGAN DOMAIN FE MU
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
};

app.use(cors(corsOptions));
// ==============================

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use('/api/', loginRoutes);
app.use('/api/', registerRoutes);
app.use('/api/barang', barangRoutes);
app.use("/api/dashboard", DashboardRoute);
app.use("/api/visitor", VisitorRoute);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
