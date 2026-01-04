const db = require("../models"); 
const Movie = db.movie; 

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la película",
      error: error.message
    });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener películas",
      error: error.message
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la película",
      error: error.message
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    await movie.update(req.body);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la película",
      error: error.message
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    await movie.update({ stateMovie: false });

    res.status(200).json({ message: "Película eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la película",
      error: error.message
    });
  }
};