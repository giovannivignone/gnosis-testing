import logo from './logo.svg';
import './App.css';

function App() {
  const InitiateGnosisTransaction = () => {
    console.log("hello")
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={InitiateGnosisTransaction}>
          Sign Gnosis Transaction
        </button>
      </header>
    </div>
  );
}

export default App;
