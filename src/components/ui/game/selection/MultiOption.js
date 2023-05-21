import Profile from '../../Profile';
import Player from 'models/Player';
import {api} from "../../../../helpers/api";
import storageManager from "../../../../helpers/StorageManager";

const MultiOption = ({currentPoll, stage}) => {

  let voteParticipantIds = currentPoll.participants.map(p => p.player.id);

  const singleVoters = ["Witch", "Hunter", "Seer", "Mayor", "Mayor-Death"];
  const singleKillVoters = ["Witch", "Hunter", "Seer", "Mayor"];
  const singleSelectVoters = ["Seer", "Mayor-Death"];

  const roleType = (currentPoll.question === "Who should become the mayor?" && currentPoll.role === "Mayor") ? "Mayor-Death": currentPoll.role;

  const getSelectionMode = (player) => {
    let selectionMode = "selection-small";
    if (singleVoters.includes(roleType)){
      selectionMode = "selection-big";
      if (currentPoll.ownVote && currentPoll.ownVote.id === player.id) {
        if (singleKillVoters.includes(roleType)) {
          selectionMode += "-kill";
        } else if (singleSelectVoters.includes(roleType)) {
          selectionMode += "-select";
        }
      } else if (currentPoll.ownVote) {
        selectionMode += "-hidden";
      }
    }
    return selectionMode;
  };

  const castVote = async (optionId) => {
    try {
      if(currentPoll.ownVote == null) {
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      } else {
        if (currentPoll.getOwnRemainingVotes() === 0) {
          await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
        }
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      }
    } catch (error) {

    }
  };

  const removeVote = async () => {
    try {
      await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
    } catch (error) {
      console.error(error);
      alert(error.response.data?.message || 'Vote failed');
    }
  };

  const selectionProfiles = (playerCollection)  => {
    return (
      <div className="game-player-selection-wrapper">
        {playerCollection.map(option => (
          <Profile user={new Player(option.player)} mode={getSelectionMode(option.player)} onClickEvent={castVote} key={`${option.player.id}-selection`} />
        ))}
      </div>
    );
  };

  const buttonTheme = (stage === "Day") ? "btn btn-remove btn-dark" : "btn btn-remove btn-light";
  const removeButton = currentPoll.ownVote && (
    <button
        className= {buttonTheme}
        onClick={removeVote}
    >
        Remove Vote
    </button>
  );

  let content;

  // Filter this to not contain top 5 of hitlist
  // let hitListMembers = currentPoll.voteArray.slice(0, 5).map(option => option[0].id);
  // let pollOptions = currentPoll.pollOptions.filter(option => !hitListMembers.includes(option.player.id));

  switch (currentPoll.role) {
    case 'Werewolf':
      content = (
        <>
        {selectionProfiles(currentPoll.pollOptions.filter(option => !voteParticipantIds.includes(option.player.id)))}
        <p><b>Your fellow werewolves:</b></p>
        {selectionProfiles(currentPoll.pollOptions.filter(option => voteParticipantIds.includes(option.player.id)))}
        </>
      );
      break;
    // Single Role Voters
    case 'Witch':
    case 'Hunter':
    case 'Seer':
    case 'Mayor': //Solve Tie and Death
      content = (
        <>
          {selectionProfiles(currentPoll.pollOptions)}
          {removeButton}
        </>
      );
      break;
    default: // Villager etc.
      content = selectionProfiles(currentPoll.pollOptions);
      break;
  }

  return (
    <div className={`game-player-selection ${currentPoll.isVoteParticipant ? "game-player-selection-active": ""}`}>
      {content}
    </div>
  );
  
}
export default MultiOption;