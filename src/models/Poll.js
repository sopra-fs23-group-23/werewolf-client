import Player from './Player';
import StorageManager from 'helpers/StorageManager';

class Poll {
  constructor(data = {}) {
    this.role = "";
    this.question = "";
    this.participants = [];
    this.pollOptions = [];
    this.voteArray = [];
    this.ownVote = null;
    this.scheduledFinish = null;
    Object.assign(this, data);
    if (data.scheduledFinish) {
      this.scheduledFinish = new Date(data.scheduledFinish);
    }
    this.setOwnVote(this.pollOptions);
    this.setVoteArray(this.pollOptions);
    this.isVoteParticipant = (this.participants.length > 0) ? true : false;
    
  }

  getOwnRemainingVotes() {
    if (this.isVoteParticipant) {
      return this.participants.filter(participant => parseInt(participant.player.id) === parseInt(StorageManager.getUserId()))[0].remainingVotes;
    }
    return 0;
  }

  getRolePlural() {
    switch (this.role) {
      case "Werewolf":
        return "Werewolves";
      case "Villager":
        return "Villagers";
      default:
        return this.role;
    }
  }

  setVoteArray(pollOptions) {
    const sortedPollOptions = pollOptions.filter(option => option.supporters.length > 0)
                                          .sort((a, b) => b.supporters.length - a.supporters.length);
    const voteArray = sortedPollOptions.map(option => {
      const supporterArray = option.supporters.map(supporter => supporter.id);
      return [new Player(option.player), supporterArray];
    });
    this.voteArray = voteArray;
  }

  setOwnVote(pollOptions) {
    for (const option of pollOptions) {
      for (const supporter of option.supporters) {
        if (parseInt(supporter.id) === parseInt(StorageManager.getUserId())) {
          this.ownVote = new Player(option.player);
          return;
        }
      }
    }
  }
}

export default Poll;
