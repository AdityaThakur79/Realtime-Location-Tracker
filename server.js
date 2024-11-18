import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const server = http.createServer(app);

// Create the Socket.IO server instance
const io = new Server(server);

app.set("view engine", "ejs");

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnected", () => {
    io.emit("user-disconnected", { id: socket.id });
  });
  
  console.log("Connected");
});

app.use("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
