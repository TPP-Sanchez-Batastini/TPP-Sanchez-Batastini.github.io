import ThreeScene from './Scene/ThreeScene';
import { useEffect } from 'react';
import { MainMenu } from './Menus/MainMenu';
import { LevelEditor } from './Menus/LevelEditor';
import { HashRouter as Router, Routes as Switch, Route } from 'react-router-dom';


function App() {

  useEffect(() => {
    document.title = 'Driving Simulator';
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/scene" element = {<ThreeScene/>} />
        <Route exact path="/" element = {<MainMenu/>} />
        <Route exact path="/level-editor" element = {<LevelEditor/>} />
      </Switch>
    </Router>
  );

}

export default App;
