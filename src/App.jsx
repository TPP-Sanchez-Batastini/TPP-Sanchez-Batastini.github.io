import ThreeScene from "./Scene/ThreeScene";
import { useEffect, useState } from "react";
import { MainMenu } from "./Menus/MainMenu";
import { LevelEditor } from "./Menus/LevelEditor";
import {
  HashRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import { LoginForm } from "./Menus/Components/LoginForm";
import { SignUpForm } from "./Menus/Components/SignUpForm";
import { SessionProvider } from "./Menus/Sessions/SessionProvider";

function App() {
  const [json, setJson] = useState(null);

  useEffect(() => {
    document.title = "Driving Simulator";
    fetch("./levels/estacionamiento.json")
      .then((response) => response.json())
      .then((data) => {
        setJson(data);
      });
  }, []);

  return (
    <SessionProvider
      childElement={
        <Router>
          <Switch>
            <Route exact path="/scene" element={json && <ThreeScene jsonLevel={json} />} />
            <Route exact path="/" element={<MainMenu />} />
            <Route exact path="/level-editor" element={<LevelEditor />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route exact path="/signup" element={<SignUpForm />} />
          </Switch>
        </Router>
      }
    />
  );
}

export default App;
