import express from 'express';
import axios from "axios";
import { describe } from 'node:test';
import { release } from 'node:os';

const app = express();
const PORT = process.env.PORT || 3000;
const OMDbapikey = "af6a90e6";

app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get("/",async(req,res)=>{
    try {
        const quoteres = await axios.get('http://localhost:5000/api/quote');
        const quote = quoteres.data.quote;
        const movietitle = quoteres.data.movie;

        const omdbres =  await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movietitle)}&apikey=${OMDbapikey}`);

        const movie = omdbres.data;
        const isvalid = movie.Response === 'True';

        res.render("index",{
            quote:quote,
            author: movietitle,
            poster: isvalid ? movie.Poster:null,
            description: isvalid ? movie.Plot :"Description NA",
            releaseDate: isvalid ? movie.Released: "Unknown" 
        })

        
    } catch (error) {
        console.error('error fetching data:', error);
        res.status(500).send('Error retriving details');
        
    }


    

});



app.listen(PORT,()=> console.log("Server is running on "+PORT));

