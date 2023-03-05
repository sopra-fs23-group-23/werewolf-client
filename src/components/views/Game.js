import React from 'react'
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { Link } from "react-router-dom";

const Player = ({user}) => (
  <div className="player container">
    <div className="player username">username: {user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object
};

// var ConditionalLink = localStorage.getItem("status") === "ONLINE" ? Link : React.DOM.div;

const Game = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);

  const logout = async () =>{
    try {
    const response = await api.put(`/users/logout/${localStorage.getItem("id")}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // See here to get more data.
    console.log('logout: ',response);
    localStorage.clear();
    history.push('/login');

  }catch (error) {
    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
    console.error("Details:", error);
    alert("Something went wrong while fetching the users! See the console for details.");
  }
}

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users');

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);

  let content = <Spinner/>;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map(user => (
            <Link to={{pathname: `/game/profile/${user.id}`, state: user.id}}>
              <Player user={user} key={user.id}/>
            </Link>
          ))}
        </ul>
        <Button
          width="100%"
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>
    );
  }
  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph" >
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
}

export default Game;
