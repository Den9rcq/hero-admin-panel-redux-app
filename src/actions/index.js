// Heroes
import { heroesFetched, heroesFetching, heroesFetchingError } from "../components/heroesList/heroesSlice";
import { filtersFetched, filtersFetching, filtersFetchingError } from "../components/heroesFilters/filtersSlice";

export const fetchHeroes = (request) => (dispatch) => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
}

// Filters
export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching())
    request('http://localhost:3001/filters')
        .then(filters => dispatch(filtersFetched(filters)))
        .catch(() => dispatch(filtersFetchingError()))
}