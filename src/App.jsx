import ThreeScene from './Scene/ThreeScene';
import { useEffect } from 'react';


function App() {

  useEffect(() => {
    document.title = 'Driving Simulator';
  }, []);

  return (
    <div>
      <ThreeScene/>
    </div>
  );
}

export default App;
