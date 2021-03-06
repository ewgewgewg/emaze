import _ from "lodash";

const movement = (direction, unit) => {
  let realDirection = direction;
  if (direction.toUpperCase() === "RANDOM") {
    let options = [];
    if (unit[1] < 4) options.push("RIGHT");
    if (unit[1] > 0) options.push("LEFT");
    if (unit[0] < 4) options.push("DOWN");
    if (unit[0] > 0) options.push("UP");
    realDirection = _.sample(options);
  }

  switch (realDirection) {
    case "RIGHT":
      return [unit[0], Math.min(unit[1] + 1, 4), unit[0], unit[1]];
    case "LEFT":
      return [unit[0], Math.max(unit[1] - 1, 0), unit[0], unit[1]];
    case "DOWN":
      return [Math.min(unit[0] + 1, 4), unit[1], unit[0], unit[1]];
    case "UP":
      return [Math.max(unit[0] - 1, 0), unit[1], unit[0], unit[1]];
    case "QUIT":
      return [4, 4, unit[0], unit[1]];
    default:
      return unit;
  }
};

const aliasFunction = (input) => {
  input = input.toUpperCase();
  if (input === "R") return "RIGHT";
  if (input === "L") return "LEFT";
  if (input === "U") return "UP";
  if (input === "D") return "DOWN";
  return input;
};

export { movement, aliasFunction };
