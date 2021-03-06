const Personaje = require('../models/Personaje');
const Pelicula = require('../models/Pelicula_o_serie');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const personajeController = {}


personajeController.getOne = async (req, res) => {

    try {

        const personaje = await Personaje.findOne({ where: { id: req.params.id } });

        for (let i = 0; i < personaje.peliculas.length; i++) {
            var peliculas = await Pelicula.findAll({ attributes: ['titulo', 'imagen'], where: { id: personaje.peliculas } })
        }

        res.status(200).json({ personaje: personaje, pelicula_asociada: peliculas });

    } catch (err) {
        res.status(500).json(err);
    }

}
personajeController.put = async (req, res) => {

    try {

        await Personaje.update({ nombre: req.body.nombre, imagen: req.body.imagen, edad: req.body.edad, peso: req.body.peso, historia: req.body.historia, peliculas: req.body.peliculas }, { where: { id: req.params.id } });

        res.status(200).json('Personaje actualizado');

    } catch (err) {
        res.status(500).json(err);
    }

}
personajeController.post = async (req, res) => {

    const newPersonaje = new Personaje(req.body);
    try {
        const savedPersonaje = await newPersonaje.save();
        res.status(200).json(savedPersonaje);
    } catch (err) {
        res.status(500).json(err);
    }

}
personajeController.delete = async (req, res) => {

    try {

        const personaje = await Personaje.destroy({ where: { id: req.params.id } });

        res.status(200).json('Personaje eliminado');

    } catch (err) {
        res.status(500).json(err);
    }

}

personajeController.get = async (req, res) => {
    try {

        if (req.query.name === undefined && req.query.age === undefined && req.query.movies === undefined) {

            const personajes = await Personaje.findAll({ attributes: ['nombre', 'imagen'] });

            res.status(200).json(personajes);
        } else {
            if (req.query.name !== undefined) {
                const personajes = await Personaje.findOne({ attributes: ['nombre', 'imagen'], where: { nombre: req.query.name } });
                res.status(200).json(personajes);
            } else if (req.query.age !== undefined) {
                const personajes = await Personaje.findAll({ attributes: ['nombre', 'imagen'], where: { edad: req.query.age } });
                res.status(200).json(personajes);
            } else if (req.query.movies !== undefined) {
                const movies = []
                movies.push(parseInt(req.query.movies));

                const personajes = await Personaje.findAll({ attributes: ['nombre', 'imagen'], where: { peliculas: { [Op.contains]: movies } } });
                res.status(200).json(personajes);
            }

        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}


module.exports = personajeController