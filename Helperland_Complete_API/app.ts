import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import { sequelize } from './models';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

dotenv.config();

const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info:{
            title:'Helperland System',
            version: '1.0.0',
            description: 'Helperland API',
            contact: {
                name: 'Rathod Rushikesh',
                url: 'https://helperland.com',
                email: 'rushir306@gmail.com'
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ['./routes/contact.routes.ts', './routes/user.routes.ts', './routes/serviceRequest.routes.ts', './routes/customerPage.routes.ts']
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

import router from "./routes/contact.routes";
import router1 from "./routes/user.routes";
import router2 from "./routes/serviceRequest.routes";
import router3 from "./routes/customerPage.routes";

//Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({dest: 'images'}).single('file'));

app.use('/', router);
app.use('/', router1);
app.use('/', router2);
app.use('/', router3);

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
    sequelize.authenticate().then(async() => {
        console.log("database connected");

        // try {
        //     await sequelize.sync();
        // }
        // catch(error){
        //     console.log(error);
        // }
    })
    .catch((e:any) => {
        console.log(e.message);
    })
});

