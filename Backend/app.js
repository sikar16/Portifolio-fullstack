

import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import { PORT, HOST } from "./src/config/secret.js";

const app = express();

app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
   // credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

import appRoute from "./src/routes/index.js";
app.use("/api", appRoute);

app.get("/", (req, res) => {
    res.send('running');
});

app.listen(PORT, HOST, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server is running on http://${HOST}:${PORT}`);
    }
});
