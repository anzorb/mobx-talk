import React, { useContext } from "react";
import "./App.css";

import { observer, useLocalStore } from "mobx-react";

import MoviesStoreContext, { MoviesStore } from "./Movies-mobx";

const Ratings = observer(function Ratings({ score }) {
	return <div>{["⭐", "⭐", "⭐", "⭐", "⭐"].splice(0, score)}</div>;
});

const Movie = observer(function Movie({ movie }) {
	const { addToQueue, like, dislike } = useContext(MoviesStoreContext);
	console.log("render", movie);

	return (
		<div>
			{addToQueue && (
				<>
					<button onClick={() => addToQueue(movie)}>Add to Queue</button>
					<button onClick={() => like(movie)}>Like</button>
					<button onClick={() => dislike(movie)}>Dislike</button>
				</>
			)}
			<div>{movie.Title}</div>
			<img src={movie.Poster} />
			{like && <Ratings score={movie.score} />}
		</div>
	);
});

const Movies = observer(function Movies() {
	const { movies } = useContext(MoviesStoreContext);

	return (
		<div className="movies">
			{movies.map(m => (
				<Movie key={m.imdbID} movie={m} />
			))}
		</div>
	);
});

const Queue = observer(function Queue() {
	const { queue } = useContext(MoviesStoreContext);

	return (
		<div className="queue">
			{queue.map(m => (
				<Movie key={m.imdbID} movie={m} />
			))}
		</div>
	);
});

const App = observer(function App() {
	const store = useLocalStore(MoviesStore);
	const { fetchAll } = store;

	return (
		<MoviesStoreContext.Provider value={store}>
			<div className="App">
				<button onClick={fetchAll}>Fetch</button>
				<Movies />
				<Queue />
			</div>
		</MoviesStoreContext.Provider>
	);
});

export default App;
