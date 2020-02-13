import { MoviesStore } from "./Movies-mobx.js";
import { act, renderHook } from "@testing-library/react-hooks";

const mockMovies = {
	Search: [
		{
			imdbID: 0,
			score: 0
		},
		{
			imdbID: 1,
			score: 0
		},
		{
			imdbID: 2,
			score: 0
		},
		{
			imdbID: 3,
			score: 0
		},
		{
			imdbID: 4,
			score: 0
		}
	]
};

const mockMoviesPage2 = {
	Search: [
		{
			imdbID: 5,
			score: 0
		},
		{
			imdbID: 6,
			score: 0
		}
	]
};

fetch.mockResponse(req => {
	switch (req.url) {
		case "http://www.omdbapi.com/?s=action&page=1&apikey=4640ef30":
			return Promise.resolve(JSON.stringify(mockMovies));
		case "http://www.omdbapi.com/?s=action&page=2&apikey=4640ef30":
			return Promise.resolve(JSON.stringify(mockMoviesPage2));
		default:
			return Promise.reject("bad url");
	}
});

describe("useMovies hook", () => {
	it("should render hook and expose an API", () => {
		const store = MoviesStore();
		expect(store.movies).toEqual([]);
		expect(store.queue).toEqual([]);
		expect(typeof store.like).toBe("function");
		expect(typeof store.dislike).toBe("function");
		expect(typeof store.addToQueue).toBe("function");
		expect(typeof store.fetchAll).toBe("function");
	});

	it("should fetch a list of movies", async () => {
		const store = MoviesStore();
		await store.fetchAll();
		expect(store.movies).toEqual(mockMovies.Search);
	});

	it("should fetch another page of movies", async () => {
		const store = MoviesStore();
		await store.fetchAll();
		await store.fetchAll();
		expect(store.movies).toEqual([
			...mockMoviesPage2.Search,
			...mockMovies.Search
		]);
	});

	it("should allow us to add movies into the queue", async () => {
		const store = MoviesStore();
		await store.fetchAll();
		store.addToQueue(store.movies[4]);
		expect(store.queue).toEqual([store.movies[4]]);
	});

	it("should allow us to like a movie", async () => {
		const store = MoviesStore();
		await store.fetchAll();
		store.like(store.movies[4]);
		expect(store.movies.map(m => m.score)).toEqual([0, 0, 0, 0, 1]);
	});

	it("should allow us to dislike a movie", async () => {
		const store = MoviesStore();
		await store.fetchAll();
		store.dislike(store.movies[4]);
		expect(store.movies.map(m => m.score)).toEqual([0, 0, 0, 0, -1]);
	});
});
