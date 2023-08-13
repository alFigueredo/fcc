const App = ({ date = "Null", colors = ["None"], tasks = ["None"] }) => {
  return (
    <div>
      <h1>Hello JSX!</h1>
      {/* This is a comment */}
      <p>Date: {date}</p>
      <p>Colors: {colors.join(", ")}</p>
      <p>Tasks: {tasks.join(", ")}</p>
      <ul>
        <li>React</li>
        <li>Redux</li>
        <li>JavaScript</li>
      </ul>
    </div>
  );
};

export default App;
