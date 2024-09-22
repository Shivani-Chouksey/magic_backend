import express from "express"
import userRoutes from "./routes/userRoutes.js"
import { connection } from "./database/connection.js";
import cors from "cors"

const PORT="8000"

const app=express();

await connection();

app.use(express.json({ limit:'Infinity'}));

app.use(cors({origin:'*',credentials:true}));
app.use("/user" ,userRoutes)

app.listen(PORT ,()=>{
    console.log(`Server s started on ${PORT}`);
    
})