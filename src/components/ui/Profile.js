import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {moveVideo, renderVideo} from 'helpers/agora';

const Profile = ({ user, mode, votes, onClickEvent, onHoverEvent }) => {


  const handleClick = () => {
    if (onClickEvent) {
      onClickEvent(user.id);
    }
  };

  const handleHover = (hoveredPlayer) => {
    if (onHoverEvent) {
      return () => onHoverEvent(hoveredPlayer);
    }
  };

  useEffect(() => {
    renderVideo(user.id, null);
    
    if((mode === "hitlist" || mode === "hitlist-leader" || mode === "lover")) {
      renderVideo(user.id, true);

      return () => {
        renderVideo(user.id, false);
      };
    }
    // setTimeout(() => {
    //   setVideoIfStream(true, user.id);
    //   return () => {
    //     setVideoIfStream(false, user.id);
    //   }
    // }, 1000);

  }, [mode, user.id]);

  let isDisplay = (mode === "hitlist" || mode === "hitlist-leader" || mode === "lover") ? "-display" : "";
  let isLog = (mode === "game-log") ? "-log" : "";
  let inHitlist = (mode === "selection-small" && document.getElementById(`profile-image-display-${user.id}`)) ? "inHitlist" : "";

  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick}>
        <div className={`video profile-${mode}-video ${inHitlist}`} id={`profile-video${isDisplay}${isLog}-${user.id}`} style={{ backgroundImage: `url(${user.avatarUrl})` }} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)}/>
        {/* <img className={`image profile-${mode}-image ${inHitlist}`} id={`profile-image${isDisplay}${isLog}-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)} src={user.avatarUrl} alt='avatar'/> */}

      <div className="profile-name">{user.name}</div>
      {votes && (
        <h2 className="profile-votes">
          {votes} {votes === 1 ? 'vote' : 'votes'}
        </h2>
      )}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;
