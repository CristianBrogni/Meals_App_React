import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = React.createContext();

const allMealsUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

function getFavoritesFromLocalStorage() {
	let favorites = localStorage.getItem("favorites");
	if (favorites) {
		favorites = JSON.parse(localStorage.getItem("favorites"));
	} else {
		favorites = [];
	}

	return favorites;
}

const AppProvider = ({ children }) => {
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedMeal, setSelectedMeal] = useState(null);
	const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

	const fetchMeals = async (url) => {
		setIsLoading(true);
		try {
			const { data } = await axios.get(url);
			if (data.meals) {
				setMeals(data.meals);
			} else {
				setMeals([]);
			}
		} catch (error) {
			console.log(error.response);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchMeals(allMealsUrl);
	}, []);

	useEffect(() => {
		if (!searchTerm) return;
		fetchMeals(`${allMealsUrl}${searchTerm}`);
	}, [searchTerm]);

	function fetchRandomMeal() {
		fetchMeals(randomMealUrl);
	}

	function selectMeal(idMeal, favoriteMeal) {
		let meal;
		if (favoriteMeal) {
			meal = favorites.find((meal) => meal.idMeal === idMeal);
		} else {
			meal = meals.find((meal) => meal.idMeal === idMeal);
		}
		setSelectedMeal(meal);
		setShowModal(true);
	}

	function closeModal() {
		setShowModal(false);
	}

	function addToFavorites(idMeal) {
		const meal = meals.find((meal) => meal.idMeal === idMeal);
		const alreadyFavorite = favorites.find((meal) => meal.idMeal === idMeal);
		if (alreadyFavorite) return;
		const updatedFavorites = [...favorites, meal];
		setFavorites(updatedFavorites);
		localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
	}

	function removeFromFavorites(idMeal) {
		const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
		setFavorites(updatedFavorites);
		localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
	}

	return (
		<AppContext.Provider
			value={{
				meals,
				isLoading,
				setSearchTerm,
				fetchRandomMeal,
				showModal,
				selectedMeal,
				selectMeal,
				closeModal,
				addToFavorites,
				removeFromFavorites,
				favorites,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };

//www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata find by name

//www.themealdb.com/api/json/v1/1/random.php find random one
