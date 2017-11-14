import { Router } from 'express';
import express from 'express';

export default({ config, db }) => {
  let api = Router();
  let app=express();
  // add middleware here
  app.set('views', __dirname+'/views');
  
  // Set EJS as the View Engine
  app.set('view engine', 'ejs');

  return api;
}
