require("babel-register")({
  presets: [
    [
      "env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ]
});

// Import the rest of our application.
module.exports = require("./server");
