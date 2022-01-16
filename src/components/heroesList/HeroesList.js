import { useHttp } from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchHeroes, heroesFetchingError, heroDeleted } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { createSelector } from "reselect";

const HeroesList = () => {

    const filteredHeroesSelector = createSelector(
        ({ filters }) => filters.activeFilter,
        ({ heroes }) => heroes,
        (activeFilter, heroes) => (
            activeFilter === 'all'
                ? heroes.heroes
                : heroes.heroes.filter(item => item.element === activeFilter)
        )
    )

    const filteredHeroes = useSelector(filteredHeroesSelector)
    const { heroesLoadingStatus } = useSelector(state => state.heroes);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes(request))

        // eslint-disable-next-line
    }, []);


    const handleDeleteHero = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(heroDeleted(id)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({ id, ...props }) => {
            return <HeroesListItem
                key={id}
                onDelete={() => handleDeleteHero(id)}
                {...props}
            />
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;