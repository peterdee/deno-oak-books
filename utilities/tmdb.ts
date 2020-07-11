import { TMDB_API_KEY } from '../config/index.ts';

class TMDB {
  private ALLOW_ADULT_CONTENT: string = 'false';
  private KEY: string;
  private LANGUAGE: string = 'en-US';
  private ORIGIN: string = 'https://api.themoviedb.org/3';

  constructor(key: string) {
    this.KEY = key;
  }

  /**
   * Get movie details
   * @param {number|string} id - movie ID
   * @returns {Promise<Response>} 
   */
  movie(id: number|string): Promise<Response> {
    return fetch(
      `${this.ORIGIN}/movie/${id}?api_key=${this.KEY}&language=${this.LANGUAGE}`,
      {
		    method: 'GET',
      },
    );
  } 

  /**
   * Search movies
   * @param {string} query - search request 
   * @param {number|string} page - pagination
   * @returns {Promise<Response>} 
   */
  search(query: string, page: number|string = 1): Promise<Response> {
    return fetch(
      `${this.ORIGIN}/search/movie?api_key=${this.KEY}&language=${
        this.LANGUAGE
      }&include_adult=${this.ALLOW_ADULT_CONTENT}&query=${query}&page=${page}`,
      {
		    method: 'GET',
      },
    );
  }
}

export default new TMDB(TMDB_API_KEY);
