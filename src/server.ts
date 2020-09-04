import cors from 'cors'
import express from 'express'
import { create } from '@open-wa/wa-automate';
import Whatsapp, { status } from './modules/Whatsapp';
import { ev } from '@open-wa/wa-automate';
import { uploadImage } from './services/helpers'


interface Status {
  statusText: boolean,
  imageUrl?: string 
}


const app = express()
app.use(cors())
const PORT = 8080;
app.use(express.json())

export const whatsappStatus: Status = {
  statusText: false
};


ev.on('qr.**', async qrcode => {
  const imageBuffer = Buffer.from(
    qrcode.replace('data:image/png;base64,', ''),
    'base64'
  );
  const imageUrl = await uploadImage({originalname: 'qrcode.png' , buffer: imageBuffer })
  whatsappStatus.imageUrl = String(imageUrl)
});

const launchConfig = {
  autoRefresh:true,
  cacheEnabled:false,
  sessionId: 'hr',
};



create(launchConfig).then(async client => {
  Whatsapp(client)
  app.use(client.middleware)
});


app.get('/', (request, response) =>{
  whatsappStatus.statusText = status
  return response.json(whatsappStatus)
})


app.listen(PORT, () => {
  console.log(`Server iniciado na porta ${PORT}`)
})