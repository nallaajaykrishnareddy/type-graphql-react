import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Bye } from "./components/Bye";
import { setAuthToken } from "./utils/AuthToken";
import { Header } from "./components/Header";

export const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      credentials: "include",
      method: "POST",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      setAuthToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <h1>loading.....</h1>;
  }

  return (
    <>
      <Router>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/bye" exact component={Bye} />
          </Switch>
        </div>
      </Router>
    </>
  );
};
