import React from 'react';
import 'styles/ui/CupidMatch.scss';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';
import storageManager from "../../../../helpers/StorageManager";
import {api} from "../../../../helpers/api";


const CupidMatch = ({currentPoll}) => {

    
    const removeLover = async (lover) => {
        try {
            await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + lover.id);
        } catch (error) {
            console.error(error);
            alert(error.response.data?.message || 'Vote failed');
        }
    };

    const getLover = (lover) => {
        return (
            <>
                <Profile user={new Player(lover)} mode="lover"/>
                <button
                    className="btn btn-light"
                    onClick={() => removeLover(lover)}
                >
                    remove Lover
                </button>
            </>
        );
    }

    return (
        <div className="cupidmatch">
                <div className="cupidmatch-lover">
                    { 1 <= currentPoll.voteArray.length ? (
                        <>
                        {getLover(currentPoll.voteArray[0][0])}
                        </>
                    ) : <div className='cupidmatch-lover-placeholder'><h3>Romeo still missing</h3></div>}
                </div>
                    <h3>Love<br/> is in the <br/>air</h3>
                <div className="cupidmatch-lover">
                    { 2 <= currentPoll.voteArray.length ? (
                        <>
                        {getLover(currentPoll.voteArray[1][0])}
                        </>
                    ) : <div className='cupidmatch-lover-placeholder'><h3>Juliet still missing</h3></div>}
                    
                </div>
        </div>
    );
}


export default CupidMatch;