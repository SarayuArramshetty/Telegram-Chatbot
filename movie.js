const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const request = require('request');

const TelegramBot = require('node-telegram-bot-api');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const token = '5524213011:AAFCLq1dy8svvpRL-6bkh4ljN8iVhrhhgNw';

const bot = new TelegramBot(token, {polling: true});

bot.on('message', function(mg){
request('http://www.omdbapi.com/?t='+mg.text+'&apikey=cbec74bb', function (error, response, body) {
  if(JSON.parse(body).Response=="True"){
    db.collection('students').add({
      key:"Title",
      dataValue:JSON.parse(body).Title,
      userID:mg.from.id,
    }).then(()=>{
        bot.sendMessage(mg.chat.id, "Title "+JSON.parse(body).Title)
      })  
      db.collection('students').add({
        key:"Actors",
        dataValue:JSON.parse(body).Actors,
        userID:mg.from.id,
      }).then(()=>{
          bot.sendMessage(mg.chat.id, "Actors "+JSON.parse(body).Actors)
        })  
        db.collection('students').add({
            key:"Released",
            dataValue:JSON.parse(body).Released,
            userID:mg.from.id,
          }).then(()=>{
              bot.sendMessage(mg.chat.id, "Released "+JSON.parse(body).Released)
            })  
            db.collection('students').add({
                key:"Rating",
                dataValue:JSON.parse(body).Ratings[0].Value,
                userID:mg.from.id,
              }).then(()=>{
                  bot.sendMessage(mg.chat.id, "Rating "+JSON.parse(body).Ratings[0].Value)
    })    
}
  else{
      bot.sendMessage(mg.chat.id, "Movie not found")
  }
});
})