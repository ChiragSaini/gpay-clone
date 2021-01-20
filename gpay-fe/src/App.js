import React, { useContext, useEffect } from "react";
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import TransactionPage from "./components/TransactionPage";
import { GPayContext } from "./context";
import io from "socket.io-client";

function App() {

  const { user, refreshUser } = useContext(GPayContext);

  useEffect(() => {
    const socket = io('http://localhost:3001/test');
    socket.on('changes', users => {
      console.log("some shit happened")
      refreshUser();
    })
  }, []);

  const GoToHomeRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) => user.token ? <Redirect to="/" /> : <Component {...props} />}
    />
  );

  const OnlyAccessIfLoggedInRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) => user.token ? <Component {...props} /> : <Redirect to="/login" />}
    />
  )

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <GoToHomeRoute exact path="/login" component={LoginPage} />
          <GoToHomeRoute exact path="/register" component={RegisterPage} />
          <OnlyAccessIfLoggedInRoute path="/pay/:receiverEmail" component={TransactionPage} />
          <Route>404: Route not FOund</Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
