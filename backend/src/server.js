import express from 'express'
import cors from "cors";
import dotenv from 'dotenv'
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from "./routes/transactionsRoute.js"
import { initDB } from './config/db.js'
import job from "./config/cron.js"

dotenv.config()

const app = express();

if (process.env.NODE_ENV === "production") job.start()

// Built-in middleware
app.use(cors());
app.use(rateLimiter)

app.use(express.json());

app.use("/api/transactions", transactionsRoute)

const PORT = process.env.PORT || 5001.

app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "ok" });
})

initDB().then(() => [
	app.listen(PORT, () => {
		console.log("Server is up and running on PORT:", PORT)
	})
])