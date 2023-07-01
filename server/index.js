require("dotenv").config();
const axios = require("axios");
const server = require("./src/server");
const { conn, Country} = require('./src/db.js');

const {
  PORT,
  DB_HOST,
DB_PORT,
DB_NAME

} = process.env;

conn.sync({ force: true }).then(() => {
server.listen(PORT, async() => {
const dbCountries= Country.findAll();
if(!dbCountries.length){
  const urlApi = await axios.get(`http://${DB_HOST}:5000/${DB_NAME}`);
  const infoApi = await urlApi.data.map((pais)=>{
    return{
   id: pais.cca3,
   name: pais.name.common,
   image: pais.flags.svg,
   continent: pais.continents[0],
   capital: pais.capital ? pais.capital[0] : "Capital",
  subregion: pais.subregion ? pais.subregion: "Subregion",
area: pais.area, 
population: pais.population,
   } 
  });
for(let i = 0; i < infoApi.length; i++){
  await Country.findOrCreate({
    where:{name:infoApi[i].name},
    defaults: infoApi[i],
  })
}

console.log('base de datos actualizada')

}


  console.log(`Server listening on port ${PORT}`);
})
}).catch(error => console.error(error))


