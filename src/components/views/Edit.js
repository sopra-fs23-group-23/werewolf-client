import { useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";


const FormFieldUsername = props => {
    return (
      <div className="profile field">
        <label className="login label">
          {props.label}
        </label>
        <input
          className="login input"
          placeholder="enter username.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };
  
  const FormFieldBirthday = props => {
  
    return (
      <div className="profile field">
        <label className="login label">
          {props.label}
        </label>
        <input
          className="login input"
          type="date"
          pattern='ddmmyyyy'
          placeholder="enter birthday.."
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  };

const Edit = () => {
    const [birthday, setBirthday] = useState(null);
    const [username, setUsername] = useState(null);

    const { id } = useParams();
    const history = useHistory();

    const updateProfile = async () => {
        try {
        const requestBody = JSON.stringify({username, birthday});
        const response = await api.put(`/users/${id}`, requestBody);

        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(response);
        history.push(`/game/profile/${id}`);

        } catch (error) {
        alert(`Something went wrong during the update: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
        <div className="profile container">
          <h1>Edit Profile</h1>
            <FormFieldUsername
              label="username"
              value={username}
              onChange={un => setUsername(un)}
            />
            <FormFieldBirthday
              label="birthday"
              value={birthday}
              onChange={n => setBirthday(n)}
            />
            <div className="login button-container">
                <Button
                    width="100%"
                    onClick={() => updateProfile()}
                    >
                    Save
                </Button>
                <Button
                    width="100%"
                    onClick={() => history.push(`/game/profile/${id}`)}
                    >
                    Back
                </Button>
            </div>
            
          </div>
      </BaseContainer>
    );
}

export default Edit;