import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import Router from './router/router';
import cors from './middleware/cors';
import delay from './middleware/delay';

var upload = multer({ dest: './mock/temp/' });
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
})); 
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());
// app.use(delay);
app.use(cors);

Router.init(express, app, upload);

export default app;
