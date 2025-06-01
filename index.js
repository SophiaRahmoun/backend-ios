require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
const uri =
	"mongodb+srv://sophiarhn:http1@<ton-cluster>.mongodb.net/backend-ios?retryWrites=true&w=majority&authSource=admin";

const Visit = require("./models/Visit");

app.use("/api/auth", authRoutes);

app.get("/api/visits", async (req, res) => {
	const visits = await Visit.find();
	res.json(visits);
});

app.post("/api/visits", async (req, res) => {
	const visit = new Visit(req.body);
	await visit.save();
	res.status(201).json(visit);
});

app.get("/api/visits/:userId", async (req, res) => {
	const visits = await Visit.find({ userId: req.params.userId });
	res.json(visits);
});
const verifyToken = require("./middleware/verifyToken");

app.post("/api/visits", verifyToken, async (req, res) => {
	const visit = new Visit({
		...req.body,
		userId: req.userId,
	});
	await visit.save();
	res.status(201).json(visit);
});
app.delete("/api/visits/:id", verifyToken, async (req, res) => {
	const visit = await Visit.findById(req.params.id);
	if (!visit || visit.userId !== req.userId) {
		return res.status(403).json({ error: "Not authorized" });
	}
	await visit.deleteOne();
	res.json({ message: "Visit deleted" });
});

app.get("/api/stats", verifyToken, async (req, res) => {
	try {
		const visits = await Visit.find({ userId: req.userId });

		if (!visits.length) {
			return res.json({
				totalVisits: 0,
				totalDuration: 0,
				avgDuration: 0,
				byCategory: {},
			});
		}

		const totalVisits = visits.length;
		const totalDuration = visits.reduce((sum, v) => sum + (v.duration || 0), 0);
		const avgDuration = totalDuration / totalVisits;

		const byCategory = {};
		for (const v of visits) {
			if (!byCategory[v.category]) {
				byCategory[v.category] = { count: 0, duration: 0 };
			}
			byCategory[v.category].count += 1;
			byCategory[v.category].duration += v.duration || 0;
		}

		res.json({
			totalVisits,
			totalDuration,
			avgDuration,
			byCategory,
		});
	} catch (err) {
		res.status(500).json({ error: "Failed to calculate stats" });
	}
});

const customCategoryRoutes = require("./routes/customCategories");
app.use("/api/categories", customCategoryRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log(" Mongodb connected");

		app.listen(3000, () => {
			console.log(" Server running on port 3000");
		});
	})
	.catch((err) => console.error(" MongoDB connection error:", err));
