import { v4 as uuidv4 } from 'uuid';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { heroCreated, heroesFetchingError } from "../../actions";

const HeroesAddForm = () => {
    const { filters, filtersLoadingStatus } = useSelector(state => state.filters)
    const dispatch = useDispatch();
    const { request } = useHttp();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        element: ''
    })

    const handlerChange = ({ name, value }) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newHero = {
            id: uuidv4(),
            ...formData
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(hero => dispatch(heroCreated(hero)))
            .catch(() => dispatch(heroesFetchingError()))

        setFormData({
            name: '',
            description: '',
            element: ''
        })
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        if (filters && filters.length > 0) {
            return filters.map(({ name, label }) => name !== 'all' && <option key={name} value={name}>{label}</option>)
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    onChange={({ target }) => handlerChange(target)}
                    value={formData.name}
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    onChange={({ target }) => handlerChange(target)}
                    value={formData.description}
                    required
                    name="description"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    onChange={({ target }) => handlerChange(target)}
                    value={formData.element}
                    required
                    className="form-select"
                    id="element"
                    name="element"
                >
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;