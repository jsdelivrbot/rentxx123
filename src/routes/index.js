import express from 'express';
import ejs from 'ejs';
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
import college from '../controller/college';
import city from '../controller/city';
import notification from '../controller/notification';
import forgotpassword from '../controller/forgotpassword';
import requests from '../controller/requests';
import reasons from '../controller/reasons';
import imageUpload from '../controller/imageUpload';

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
      //admin will add delete  fetch products by college
      router.use('/college', college({ config, db }));
       //admin will add delete  fetch products by city
       router.use('/city', city({ config, db }));
     //user will add delete update bid here
    router.use('/bid', bid({ config, db }));
    //user will add chat here
    router.use('/chat', chat({ config, db }));
    //user will notification here
    router.use('/notification', notification({ config, db }));
    //user will change password here
    router.use('/forgotpassword', forgotpassword({ config, db }));
    //user will change reasons here
    router.use('/reasons', reasons({ config, db }));
    //user will change reasons here
    router.use('/imageUpload', imageUpload({ config, db }));
});

export default router;
