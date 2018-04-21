import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config';
import routes from './routes';
import path from 'path';
import cors from 'cors';
let app = express();
app.server = http.createServer(app);

// middleware
// parse application/json
app.use(bodyParser.json({
  limit : config.bodyLimit
}));

// passport config

// api routes v1
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(cors()); 
app.use('/assets',express.static(__dirname+'/public'));
app.use('/v1', routes);
app.get('/',function(req,res){
  
   res.sendFile(__dirname+'/index.html');   
  })
app.server.listen(app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
}));

console.log(`Started on port ${app.server.address().port}`);

export default app;
