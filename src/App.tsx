import "./App.css";

function App() {
  const items = ["India", "Pakistan", "Nepal", "US", "UK"];
  return (
    <>
      <h1>List</h1>
      {items.length === 0 ? <p>No items </p> : null}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
