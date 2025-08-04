import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

// Enable CORS for all routes
app.use((req, res, next) => {
    // Allow requests from any origin (you can restrict this in production)
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist"), {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript')
            } else if (filePath.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css')
            } else if (filePath.endsWith('.html')) {
                res.setHeader('Content-Type', 'text/html')
            }
        }
    }))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"))
    })
}

app.listen(PORT, () => {
    console.log('====================================')
    console.log(`Server is running on ${PORT}`)
    console.log('====================================')
    connectDB()
})