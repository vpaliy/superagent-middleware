"use strict";
const superagent = require("superagent");

const abort = message => {
  throw new Error(message);
};

const applyMiddleware = middleware => request => {
  switch (typeof request) {
    case "function":
      return (...args) => middleware(() => request(...args));
    case "object":
      const requests = Object.keys(request)
        .filter(method => typeof request[method] === "function")
        .map(name => ({
          name,
          method: applyMiddleware(middleware)(request[name])
        }))
        .reduce(
          (acc, curr) => ({
            ...acc,
            [curr.name]: (...args) => curr.method(...args)
          }),
          {}
        );
      if (!Object.keys(requests).length) {
        abort("Invalid request object. No functions.");
      }
      return requests;
    default:
      abort("Invalid params.");
  }
};

module.exports = applyMiddleware;
