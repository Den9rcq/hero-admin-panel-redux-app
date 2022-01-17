import { createAsyncThunk, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroAdapter = createEntityAdapter()
const initialState = heroAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
})


export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/heroes")
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => {
            heroAdapter.addOne(state, action.payload)
        },
        heroDeleted: (state, action) => {
            heroAdapter.removeOne(state, action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchHeroes.pending, state => {
                state.heroesLoadingStatus = 'loading'
            })
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                heroAdapter.setAll(state, action.payload)
                state.heroesLoadingStatus = 'idle'
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error'
            })
            .addDefaultCase(() => {
            })
    }
})

const { selectAll } = heroAdapter.getSelectors(state => state.heroes)

// Передача селектора с отфильтрованными героями
export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    (state) => selectAll(state),
    (activeFilter, heroes) => (
        activeFilter === 'all'
            ? heroes
            : heroes.filter(item => item.element === activeFilter)
    )
)

const { actions, reducer } = heroesSlice

export const {
    heroCreated,
    heroDeleted
} = actions

export default reducer