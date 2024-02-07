import { HelyxGridLayer } from "./grid_layer.js"

Hooks.on("init", function () {
  PIXI.BitmapFont.from("GridFont", { ...CONFIG.canvasTextStyle, fontFamily: 'Arial' }, { chars: PIXI.BitmapFont.ALPHANUMERIC });
  CONFIG.Canvas.layers.gridNumbers = { layerClass: HelyxGridLayer, group: "primary" };
  game.keybindings.register("grid-numbers", "showGridNumbers", 
  {
    name: "Toggle grid numbers",
    hint: "Shows a number of each cell on a grid",
    editable: [{ key: "KeyN" }],
    onDown: () => {
      const gridCanvasLayer = canvas.layers.find((layer) => layer.name === "HelyxGridLayer")
      gridCanvasLayer.toggle_display();
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  game.keybindings.register("grid-numbers", "moveGridUp", 
  {
    name: "Move grid up",
    hint: "Move grid Up",
    editable: [{ key: "KeyW" }],
    onDown: () => {
      const gridCanvasLayer = canvas.layers.find((layer) => layer.name === "HelyxGridLayer")
      gridCanvasLayer.moveGrid(0, -1);
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

    game.keybindings.register("grid-numbers", "moveGridDown", 
  {
    name: "Move grid down",
    hint: "Move grid down",
    editable: [{ key: "KeyS" }],
    onDown: () => {
      const gridCanvasLayer = canvas.layers.find((layer) => layer.name === "HelyxGridLayer")
      gridCanvasLayer.moveGrid(0, 1);
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

      game.keybindings.register("grid-numbers", "moveGridWest", 
  {
    name: "Move grid west",
    hint: "Move grid west",
    editable: [{ key: "KeyA" }],
    onDown: () => {
      const gridCanvasLayer = canvas.layers.find((layer) => layer.name === "HelyxGridLayer")
      gridCanvasLayer.moveGrid(-1, 0);
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

      game.keybindings.register("grid-numbers", "moveGridEast", 
  {
    name: "Move grid east",
    hint: "Move grid east",
    editable: [{ key: "KeyD" }],
    onDown: () => {
      const gridCanvasLayer = canvas.layers.find((layer) => layer.name === "HelyxGridLayer")
      gridCanvasLayer.moveGrid(1, 0);
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
})
