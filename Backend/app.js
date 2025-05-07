// import express, { urlencoded } from "express"
// import cors from "cors"
// import bodyParser from "body-parser";
// import { PORT,HOST } from "./src/config/secret.js"
// const app=express()

// app.use(express.json())
// app.use(urlencoded({ extended: true }))
// app.use(cors())
// app.use(bodyParser.json({ limit: '50mb' }))
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// app.use(cors({
//     origin: 'http://localhost:5173', 
//     methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"], 
//     credentials: true
//   }));

// import appRoute from "./src/routes/index.js"
// app.use("/api",appRoute)
// app.get("/", (req, res, next) => {
//     res.set('Access-Control-Allow-Origin', '*'); 
//     res.send('running');
//   });
  
// app.listen(PORT,HOST,(error)=>{
//     if(error){console.log(error)}
//         else{
//             console.log(`Server is running on http://${HOST}:${PORT}`);
//         }
// })


import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import { PORT, HOST } from "./src/config/secret.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true
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
