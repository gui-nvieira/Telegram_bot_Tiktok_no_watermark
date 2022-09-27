const env = require('./.env.local');
require('dotenv/config');
const Telegraf = require('telegraf');
const axios = require("axios");
const {X_RAPIDAPI_KEY} = process.env;
const bot = new Telegraf.Telegraf(env.token);


console.log('O bot está rodando');

bot.start(content => {
    const from = content.update.message.from;
    console.log(from);
    content.reply(`Muito bem-vindo, ${from.first_name}!`);
    content.reply(`Envie um link do tiktok e automaticamente o vídeo será enviado`);
});

bot.on('text', (content, next)=>{
    try{
        const texto = content.update.message.text;
        const id = content.update.message.from.id;
        if(texto.indexOf('tiktok.com')>-1){
        content.reply(`Vamos ver seu link, espere 5 segundos, aproximadamente`);         
        const options = {
            method: 'GET',
            url: 'https://tiktok-download-no-watermark.p.rapidapi.com/download',
            params: {url: texto},
            headers: 
            {'X-RapidAPI-Key': X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'tiktok-download-no-watermark.p.rapidapi.com'}
        };

        axios.request(options).then(function (response) {
            console.log('Video enviado');
            bot.telegram.sendVideo(id, response.data);
        }).catch(function (error) {
            bot.telegram.sendMessage(id,'Ocorreu um erro na API');
            console.error(error);            
        });}else {
            bot.telegram.sendMessage(id,'Você não inseriu um link válido, tente novamente');
          }
    

    }catch(e){
        console.log('ocorreu um erro no processo', e);
    }

});


bot.startPolling();
