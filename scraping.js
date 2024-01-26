const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

const app = express();
const url = 'https://elpais.com/ultimas-noticias/';

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const links = [];
        $('h2 a').each((index, element) => {
            const link = $(element).attr('href');
            links.push(link);
        });
        console.log(links)

        
        const finalArray = [];

        for (const link of links) {
            const innerURL = `${link}`;
            const response = await axios.get(innerURL);
            const innerPage = response.data;
            const $ = cheerio.load(innerPage);

            const noticia = {
                imagen: [],
                descripcion: [],
            }
    
            const titulo = $('h1').text();
            noticia.titulo= titulo
            console.log(titulo)
            
            // $('figure span img').each((index,element) => {
            //     const img = $(element).attr('src')
            //     noticia.imagen.push(img)
            //     console.log("imgs", img)
            // })

            const descripcion = $('h2').text();
            noticia.descripcion= descripcion
            console.log(descripcion)

            // const imagen = $('img').attr('src');
            // const descripcion = $('meta[name="description"]').attr('content');
            // const enlace = innerURL;

            finalArray.push(noticia);
        }
        res.send(`
        <p>LINKS</p>
        <ul>
          ${links.map(data => `<li>${data}</li>`).join('')}
        </ul>
        <p>Cantantes</p>
        <ul>
          ${finalArray.map(data => `
            <li>
              <h2>${data.titulo}</h2>
              <p>Descripción: ${data.descripcion.map(text => `<p>${text}</p>`).join('')}</p>

      
            </li>`
          )}
        </ul>
        `)
        // fs.writeFileSync('noticias.json', JSON.stringify(finalArray, null, 2));

        
        // res.json(finalArray);

        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
})

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000');
});


