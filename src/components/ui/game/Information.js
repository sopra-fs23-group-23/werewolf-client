import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import 'styles/views/Information.scss';
import AllRolesColumn from "../AllRolesColumn";
import SingleRoleInformation from "../SingleRoleInformation";
import Spinner from "../Spinner";
import StorageManager from "../../../helpers/StorageManager";

export const Information = () => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();
  const [allRoles, setAllRoles] = useState([]);
  const [ownRoles, setOwnRoles] = useState([]);
  // eslint-disable-next-line
  const [showAllRoles, setShowAllRoles] = useState(false);

  const filterRoles = (roleList) => {
    let filteredList = roleList.filter(role => role.roleName !== 'Mayor' && role.roleName !== 'Lover');
    for(const role of filteredList) {

      if(role.roleName !== "Villager") {
        continue;
      }
      for(const innerRole of filteredList) {
        if((innerRole.roleName === "Hunter") || (innerRole.roleName === "Cupid" || (innerRole.roleName === "Seer") ||
          (innerRole.roleName === "Witch"))) {
          role.amount -= innerRole.amount;
        }
      }
    }
    return filteredList;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const responseAll = await api.get('/lobbies/' + lobbyId + "/roles");
        const filtered = filterRoles(responseAll.data);
        setAllRoles(filtered);
        const responseOwn = await api.get('/lobbies/' + lobbyId + "/roles/" + id);
        setOwnRoles(responseOwn.data);
      } catch (error) {
        alert('Could not fetch role information' + error.response.data?.message);
        console.error(error);
      }
    }
    setTimeout(()=>{setShowAllRoles(true)}, 5000)
    fetchData();
  }, [id, lobbyId]);

  const game_spinner = (
    <div>
      <h5>Game starts shortly...</h5>
    </div>
  );
  if((ownRoles.length === 0) || (allRoles.length === 0)) {
    return (<Spinner theme='light'/>);
  } else if (showAllRoles) {
    return (
      <div className="all-role-container">
        <h5>Roles in this game</h5>
        <AllRolesColumn roles={allRoles} />
        <p>Your assigned role and the roles in the game can be viewed during the game by clicking the info button.</p>
        {game_spinner}
      </div>
    );
  }
  return (
    <div className="own-role-container">
      <SingleRoleInformation role={ownRoles[0]} isOwnRole={true} displayCount={false}/>
      {game_spinner}
    </div>
  )
};