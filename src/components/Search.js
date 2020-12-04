import React, { Component } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import WordLimit from "react-word-limit";

import "../css/search.css";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            results: {},
            isLoading: false,
            message: ""
        }
    }

    // fetching search results
    fetchSearchResults = (query) => {
        const jsonUrl = `https://jsonplaceholder.typicode.com/posts?q=${query}`;

        axios.get(jsonUrl)
            .then(res => {
                const resNotFoundMsg = !res.data.length ? "Sorry, we couldn't find anything" : "";
                this.setState({
                    results: res.data,
                    message: resNotFoundMsg,
                    isLoading: false
                })
            })
    };

    // handling input change
    handleOnInputChange = (ev) => {
        const query = ev.target.value;
        this.setState({ query: query, isLoading: true, message: "" }, () => {
            this.fetchSearchResults(query);
        });
    };

    // rendering search results
    renderSearchResult = () => {
        const { results } = this.state;

        if (Object.keys(results).length && results.length) {
            return (
                <div>
                    {results.map((result) => {
                        return (
                            <div key={result.id} className="result-item">
                                <a href="#!"><h3>{result.title}</h3></a>
                                <WordLimit limit={140}>{result.body}</WordLimit>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

    render() {
        const { query, isLoading, message } = this.state;

        return (
            <div className="container">
                {/* search bar */}
                <div className="search-container">
                    <label className="search-input">
                        <i className="fas fa-search search-icon" />
                        <DebounceInput
                            debounceTimeout={300}
                            minLength={2}
                            type="text"
                            value={query}
                            name="query"
                            id="search-input"
                            placeholder="Search..."
                            onChange={this.handleOnInputChange}
                        />
                    </label>
                </div>
                <div className="results-container">
                    {/* results status */}
                    <div className={`result-item results-status ${isLoading ? "show" : "hide"}`}>
                        <p>
                            <i className="fas fa-circle-notch"></i>
                            Loading...
                        </p>
                    </div>
                    <div className={`result-item results-status ${message ? "show" : "hide"}`}>
                        <p>
                            <i className="fas fa-times"></i>
                            {message}
                        </p>
                    </div>

                    {/* results */}
                    {!isLoading && this.renderSearchResult()}
                </div>


            </div>
        )
    }
}

export default Search;
