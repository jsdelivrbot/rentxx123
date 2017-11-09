import express from 'express';
import config from '../config';
import initializeDb from '../db';
import middleware from '../middleware';
import user from '../controller/user';
import login from '../controller/login';
import product from '../controller/product';
import category from '../controller/category';
import subCategory from '../controller/subCategory';
import bid from '../controller/bid';
import chat from '../controller/chat';
import notification from '../controller/notification';
import requests from '../controller/requests';

let router = express();

// connect to db
initializeDb(db => {

  // internal middleware
  router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  router.use('/user', user({ config, db }));
  //user will login here
  router.use('/login', login({ config, db }));
   //user will add delete update requests here
   router.use('/requests', requests({ config, db }));
    //user will add delete update product here
    router.use('/product', product({ config, db }));
    //admin will add delete  fetch products by category
    router.use('/category', category({ config, db }));
     //admin will add delete  fetch products by subcategory
     router.use('/subcategory', subCategory({ config, db }));
     //user will add delete update bid here
    router.use('/bid', bid({ config, db }));
    //user will add chat here
    router.use('/chat', chat({ config, db }));
    //user will notification here
    router.use('/notification', notification({ config, db }));
});

export default router;
