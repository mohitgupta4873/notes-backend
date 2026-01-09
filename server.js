const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");

require("dotenv").config();


const app = express();
app.use(
  cors({
    origin: "*", // for now (we’ll tighten later)
  })
);

app.use(express.json());

connectDB();

const testRoutes = require("./routes/testRoutes");

app.use("/api", testRoutes);
app.use("/api/notes", noteRoutes);


// basic route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({
    message: "Data received successfully",
    data: req.body,
  });
});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
