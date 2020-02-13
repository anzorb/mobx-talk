import React from "react";
import { observable, action } from "mobx";

export const MoviesStore = () => {
	let page = 1;
	const store = observable({
		movies: [],
		get queue() {
			return store.movies.filter(m => m.inQueue);
		},
		fetchAll: action(async () => {
			const res = await fetch(
				`http://www.omdbapi.com/?s=action&page=${page}&apikey=4640ef30`
			);
			const newMovies = await res.json();
			store.movies.unshift(...newMovies.Search.map(m => ({ ...m, score: 0 })));
			page++;
		}),
		addToQueue: action(movie => {
			movie.inQueue = true;
		}),
		like: action(movie => {
			movie.score++;
		}),
		dislike: action(movie => {
			movie.score--;
		})
	});

	return store;
};

export default React.createContext();
