import _ from "lodash";
import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import "./App.css";

//const prompt = require("prompt-sync")();
import { movement, aliasFunction, goCondition } from "./utils";

function App() {
  const [play, setPlay] = useState(true);
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

  const game = () => {
    const endCriteria = [false, false];

    let welcome = prompt(
      "Welcome to the Dungeon! Would you like to ENTER? "
    ).toUpperCase();

    while (welcome !== "ENTER") {
      welcome = prompt(
        "You are floating in limbo. Would you like to ENTER? "
      ).toUpperCase();
    }

    const dungeon = [[], [], [], [], []].map((a) => ["x", "x", "x", "x", "x"]);
    let playerLocation = [0, 0, 0, 0],
      monsterLocation = [4, 0, 4, 0];

    while (goCondition(playerLocation, [monsterLocation])) {
      const map = _.cloneDeep(dungeon);
      map[playerLocation[0]][playerLocation[1]] = "o";
      map[monsterLocation[0]][monsterLocation[1]] = "m";
      console.log(map);
      let playerDirection = prompt("LEFT, RIGHT, DOWN, OR UP? ");
      if (playerDirection.toUpperCase() === "QUIT") {
        endCriteria[1] = true;
      }
      playerDirection = aliasFunction(playerDirection);
      playerLocation = movement(playerDirection, playerLocation);
      monsterLocation = movement("RANDOM", monsterLocation);
    }

    const map = _.cloneDeep(dungeon);
    map[playerLocation[0]][playerLocation[1]] = "o";
    map[monsterLocation[0]][monsterLocation[1]] = "m";
    console.log(map);

    if (
      monsterLocation[0] === playerLocation[0] &&
      monsterLocation[1] === playerLocation[1]
    ) {
      endCriteria[0] = true;
    }

    return endCriteria;
  };

  // while (play) {
  //   let [eaten, quit] = game();
  //   if (eaten) {
  //     console.log("You have been eaten!");
  //   } else console.log("You have reached the end of the dungeon!");

  //   if (quit) {
  //     break;
  //   }

  //   let restart = prompt(
  //     "Would you like to RESTART your journey? "
  //   ).toUpperCase();
  //   if (restart !== "RESTART") {
  //     setPlay(play);
  //   }
  // }

  useEffect(() => {
    if (response === "ENTER") setNarrative("You have entered the dungeon.");
  }, [response]);

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
  }, [turn]);

  useEffect(() => {
    const copyGameMap = gameMap.slice();
    copyGameMap[monsterLocation[0]][monsterLocation[1]] = "m";
    setGameMap(copyGameMap);
    if (
      monsterLocation[0] === playerLocation[0] &&
      monsterLocation[1] === playerLocation[1]
    ) {
      endCriteria[0] = true;
      setEndCriteria([true, false, false]);
    }
  }, [monsterLocation]);

  useEffect(() => {
    const [eaten, quit, win] = endCriteria;
    if (eaten) {
      setNarrative("You have been eaten!");
      setTimeout(() => {
        const tempStartDungeon = startDungeon;
        tempStartDungeon[0][0] = "o";
        setGameMap(tempStartDungeon);
        setPlayerLocation([0, 0, 0, 0]);
        setMonsterLocation([4, 0, 4, 0]);
        setNarrative("Game reset!");
      }, 1000);
    }
    if (win) {
      setNarrative("You have won!");
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
