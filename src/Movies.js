import { useState, useRef } from "react";

export const useMovies = () => {
	const [movies, setMovies] = useState([]);
	const page = useRef(1);

	async function fetchAll() {
		const res = await fetch(
			`http://www.omdbapi.com/?s=action&page=${page.current}&apikey=4640ef30`
		);
		const newMovies = await res.json();
		setMovies(movies => [
			...newMovies.Search.map(m => ({ ...m, score: 0 })),
			...movies
		]);
		page.current++;
	}

	function _addToQueue(movie) {
		setMovies(movies => {
			const moviesCopy = [...movies];
			const idx = moviesCopy.indexOf(movie);
			moviesCopy.splice(idx, 1, { ...movie, inQueue: true });
			return moviesCopy;
		});
	}

	function _like(movie) {
		setMovies(movies => {
			const moviesCopy = [...movies];
			const idx = moviesCopy.indexOf(movie);
			moviesCopy.splice(idx, 1, { ...movie, score: movie.score + 1 });
			return moviesCopy;
		});
	}

	function _dislike(movie) {
		setMovies(movies => {
			const moviesCopy = [...movies];
			const idx = moviesCopy.indexOf(movie);
			moviesCopy.splice(idx, 1, { ...movie, score: movie.score - 1 });
			return moviesCopy;
		});
	}

	const addToQueue = useRef(_addToQueue);
	const like = useRef(_like);
	const dislike = useRef(_dislike);

	return {
		movies,
		queue: movies.filter(m => m.inQueue),
		like: like.current,
		dislike: dislike.current,
		addToQueue: addToQueue.current,
		fetchAll
	};
};
