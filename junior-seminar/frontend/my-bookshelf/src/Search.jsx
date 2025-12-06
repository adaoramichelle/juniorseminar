import './Search.css'
function Search(props) {
    return (
        <div className="search-container">
            <form action="search" onSubmit={props.handleSearch}>
                <input className="search-bar" type="text" placeholder="Search for books" value={props.searchInput} onChange={props.handleFormChange} />
                <button onClick={props.handleSearch} type="search">Search</button>
            </form>
            <button onClick={props.clearSearch} type="clear">Clear</button>
        </div>
    )
}
export default Search;
