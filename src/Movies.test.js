import { useMovies } from "./Movies.js";
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
		const { result } = renderHook(() => useMovies());
		expect(result.current.movies).toEqual([]);
		expect(result.current.queue).toEqual([]);
		expect(typeof result.current.like).toBe("function");
		expect(typeof result.current.dislike).toBe("function");
		expect(typeof result.current.addToQueue).toBe("function");
		expect(typeof result.current.fetchAll).toBe("function");
	});

	it("should fetch a list of movies", async () => {
		const { result } = renderHook(() => useMovies());
		await act(async () => await result.current.fetchAll());
		expect(result.current.movies).toEqual(mockMovies.Search);
	});

	it("should fetch another page of movies", async () => {
		const { result } = renderHook(() => useMovies());
		await act(async () => await result.current.fetchAll());
		await act(async () => await result.current.fetchAll());
		expect(result.current.movies).toEqual([
			...mockMoviesPage2.Search,
			...mockMovies.Search
		]);
	});

	it("should allow us to add movies into the queue", async () => {
		const { result } = renderHook(() => useMovies());
		await act(async () => await result.current.fetchAll());
		act(() => result.current.addToQueue(result.current.movies[4]));
		expect(result.current.queue).toEqual([result.current.movies[4]]);
	});

	it("should allow us to like a movie", async () => {
		const { result } = renderHook(() => useMovies());
		await act(async () => await result.current.fetchAll());
		act(() => result.current.like(result.current.movies[4]));
		expect(result.current.movies.map(m => m.score)).toEqual([0, 0, 0, 0, 1]);
	});

	it("should allow us to dislike a movie", async () => {
		const { result } = renderHook(() => useMovies());
		await act(async () => await result.current.fetchAll());
		act(() => result.current.dislike(result.current.movies[4]));
		expect(result.current.movies.map(m => m.score)).toEqual([0, 0, 0, 0, -1]);
	});
});
