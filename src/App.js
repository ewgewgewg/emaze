import _ from "lodash";
import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import "./App.css";
import { movement, aliasFunction } from "./utils";

function App() {
  const [narrative, setNarrative] = useState(
    "Welcome to the Dungeon! Would you like to ENTER? "
  );
  const [response, setResponse] = useState("");
  const startDungeon = [[], [], [], [], []].map((a) => [
    "x",
    "x",
    "x",
    "x",
    "x",
  ]);
  const [gameMap, setGameMap] = useState(startDungeon);
  const [endCriteria, setEndCriteria] = useState([false, false, false]);
  const [playerLocation, setPlayerLocation] = useState([0, 0, 0, 0]);
  const [monsterLocation, setMonsterLocation] = useState([4, 0, 4, 0]);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    const keyTranslation = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
    };
    const handleKeydown = (e) => {
      switch (e.keyCode) {
        case keyTranslation.left:
          doAction("l");
          break;
        case keyTranslation.up:
          doAction("u");
          break;
        case keyTranslation.right:
          doAction("r");
          break;
        case keyTranslation.down:
          doAction("d");
          break;
        default:
          break;
      }
    };
    const doAction = (response) => {
      const copyGameMap = gameMap.slice();
      copyGameMap[playerLocation[0]][playerLocation[1]] = "x";
      const command = aliasFunction(response);
      const tempPlayerLocation = movement(command, playerLocation);
      if (
        tempPlayerLocation[0] === gameMap.length - 1 &&
        tempPlayerLocation[1] === gameMap.length - 1
      ) {
        setEndCriteria([false, false, true]);
      }
      copyGameMap[tempPlayerLocation[0]][tempPlayerLocation[1]] = "o";
      setPlayerLocation(tempPlayerLocation);
      setGameMap(copyGameMap);
      setTurn(turn + 1);
      setResponse("");
      if (
        tempPlayerLocation[0] !== copyGameMap.length - 1 &&
        tempPlayerLocation[1] !== copyGameMap[0].length
      )
        setNarrative("You have advanced a turn.");
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [playerLocation, gameMap, turn]);

  useEffect(() => {
    if (!turn) {
      const copyGameMap = gameMap.slice();
      copyGameMap[playerLocation[0]][playerLocation[1]] = "o";
      setGameMap(copyGameMap);
      return;
    }
    const copyGameMap = gameMap.slice();
    copyGameMap[monsterLocation[0]][monsterLocation[1]] = "x";
    setGameMap(copyGameMap);
    setMonsterLocation(movement("RANDOM", monsterLocation));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  useEffect(() => {
    const copyGameMap = gameMap.slice();
    copyGameMap[monsterLocation[0]][monsterLocation[1]] = "m";
    setGameMap(copyGameMap);
    if (
      monsterLocation[0] === playerLocation[0] &&
      monsterLocation[1] === playerLocation[1]
    ) {
      setEndCriteria([true, false, false]);
    }
  }, [monsterLocation]);

  useEffect(() => {
    const [eaten, quit, win] = endCriteria;
    const variableFeedback = eaten ? "been eaten" : "won";
    if (eaten || win) {
      setNarrative(`You have ${variableFeedback}!`);
      setTimeout(() => {
        const tempStartDungeon = startDungeon;
        tempStartDungeon[0][0] = "o";
        setGameMap(tempStartDungeon);
        setPlayerLocation([0, 0, 0, 0]);
        setMonsterLocation([4, 0, 4, 0]);
        setNarrative("Game reset!");
      }, 1000);
    }
  }, [endCriteria]);

  const enterListener = (e) => {
    if (e.key === "Enter") {
      const copyGameMap = gameMap.slice();
      copyGameMap[playerLocation[0]][playerLocation[1]] = "x";
      const command = aliasFunction(response);
      const tempPlayerLocation = movement(command, playerLocation);
      if (
        tempPlayerLocation[0] === gameMap.length - 1 &&
        tempPlayerLocation[1] === gameMap.length - 1
      ) {
        setEndCriteria([false, false, true]);
      }
      copyGameMap[tempPlayerLocation[0]][tempPlayerLocation[1]] = "o";
      setPlayerLocation(tempPlayerLocation);
      setGameMap(copyGameMap);
      setTurn(turn + 1);
      setResponse("");
      setNarrative("You have advanced a turn.");
    }
  };

  return (
    <div className="App">
      <div>{narrative}</div>
      <TextField
        value={response}
        onKeyDown={enterListener}
        onChange={(event) => setResponse(event.target.value)}
      />
      {gameMap.map((row) => (
        <div>{JSON.stringify(row)}</div>
      ))}
    </div>
  );
}

export default App;
