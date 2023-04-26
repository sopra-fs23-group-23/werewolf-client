import { useEffect, useState, useCallback } from "react";
import { api } from "helpers/api";
import LobbyModel from "models/Lobby";
import StorageManager from "helpers/StorageManager";
import { startBasicCall } from "helpers/agora";
import { createEventSource } from "helpers/createEventSource";
import { useHistory } from "react-router-dom";

export const useLobbySSE = () => {
  const lobbyId = StorageManager.getLobbyId();
  const uid = StorageManager.getUserId();
  const token = StorageManager.getUserToken();
  const [lobby, setLobby] = useState(null);
  const history = useHistory();

  const updateDataToLobby = useCallback((data) => {
    console.log("updateDataToLobby", data.lobby)
    const lobby = new LobbyModel(data);
    setLobby(lobby);
  }, []);

  const fetchLobby = useCallback(async () => {
    try {
      const response = await api.get(`/lobbies/${lobbyId}`);
      updateDataToLobby(response.data);
    } catch (error) {
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the lobby! See the console for details."
      );
    }
  }, [updateDataToLobby, lobbyId]);

  const fetchChannelToken = useCallback(async () => {
    try {
      const response = await api.get(`agora/${lobbyId}/token`);
      StorageManager.setChannelToken(response.data);
    } catch (error) {
      console.error("Details: ", error);
      alert(
        "Something went wrong while fetching the channeltoken! See the console for details."
      );
    }
  }, [lobbyId]);

  const subscribeToEmitter = useCallback(async (userToken) => {
    const eventSource = createEventSource(`/lobbies/${lobbyId}/sse/${userToken}`);

    eventSource.addEventListener("update", (event) => {
      console.log("Lobby event.data", event.data);
      updateDataToLobby(JSON.parse(event.data));
    });
    eventSource.addEventListener("delete", (event) => {
      alert("Received event on 'delete', which is not implemented yet.");
    });
    eventSource.addEventListener("game", (event) => {
      eventSource.close();
      history.push("/game");
    });

  }, [updateDataToLobby, lobbyId, history])

  useEffect(() => {
    async function fetchData() {
      await fetchLobby();
      await fetchChannelToken();
      await subscribeToEmitter(token);
      startBasicCall();
    }
    fetchData().then();
  }, [
    lobbyId,
    token,
    fetchChannelToken,
    fetchLobby,
    subscribeToEmitter,
  ]);
  return { lobby, uid };
};