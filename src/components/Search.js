import { useState } from "react";
import { useGlobalContext } from "../context";

const Search = () => {
	const { setSearchTerm, fetchRandomMeal } = useGlobalContext();
	const [text, setText] = useState("");

	function handleChange(event) {
		setText(event.target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (text) {
			setSearchTerm(text);
		}
	}

	function handleRandomMeal() {
		setSearchTerm("");
		setText("");
		fetchRandomMeal();
	}

	return (
		<header className="search-container">
			<form onSubmit={handleSubmit}>
				<input
					className="form-input"
					placeholder="Type your favorite meal"
					type="text"
					onChange={handleChange}
					value={text}
				></input>
				<button type="submit" className="btn">
					Search
				</button>
				<button
					type="button"
					className="btn btn-hipster"
					onClick={handleRandomMeal}
				>
					Surprise Me
				</button>
			</form>
		</header>
	);
};

export default Search;
