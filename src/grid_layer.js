export class HelyxGridLayer extends CanvasLayer 
{
   
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /**
        @brief      IF true, display the grid
        @type {boolean}
    **/
    #display = false;  

    /**

        @brief      Horizontal case offset to use to position case (0,0) of the grid
        @type {Number}

    **/
    #offset_x = 6;

    /**

        @brief      Vertical case offset to use to position case (0,0) of the grid
        @type {Number}

    **/
    #offset_y = 6;

    /**
        @brief      Container of drawn elements
        @type {PIXI.Container}

    **/
    #drawn_elements = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor() 
    {
        super();

        this.#display = false;
        this.#drawn_elements = null;
	    this.#offset_x = 6;
	    this.#offset_y = 9;
    }

    /** @} **/ /*****************************************************************/
    /** \name   Private Methods
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Getters / Setters
    **/ /** @{ ******************************************************************/

    /**
   
        @brief Cached container with numbers
        @return {GridLayer}
    **/
    grid_layer() { return canvas.grid; }

    /** @} **/ /*****************************************************************/
    /** \name   Public Methods
    **/ /** @{ ******************************************************************/

    /**
        @brief          Retrieve the (x,y) offsets from the scene flags
    **/
    retrieve_offsets()
    {
        let offsets = game.scenes.current.getFlag('helyx-pbd-qol','offsets');
        if (offsets == undefined) 
        { offsets = { x: 6, y: 9} } 
  
        this.#offset_x = offsets.x;
        this.#offset_y = offsets.y;
    }





  /**
   * Get container with drawn numbers
   * @return {PIXI.Container}
  */
  getGridNumbersContainer(offsetX, offsetY) {
    const textContainer = new PIXI.Container({ name: "grid-numbers" });
    const gridLayer = this.grid_layer();

    // Nothing to draw if there is no grid layer.
    if (!gridLayer?.grid) return;

    const gridType = gridLayer.type;
    const isHexGrid = gridLayer.isHex;
    /*
      There are even and odd lines in hex grid.
      Added size of even and odd lines combined is 1 + 0.5 = 1.5
      Then size of one row is 1.5 / 2
      More info here https://redblobgames.com/grids/hexagons/#size-and-spacing
    */
    const HEX_ROW_SIZE_MULTIPLIER = 1.5 / 2;

    /* Grid types list
      0: "SCENES.GridGridless"
      1: "SCENES.GridSquare"
      2: "SCENES.GridHexOddR"
      3: "SCENES.GridHexEvenR"
      4: "SCENES.GridHexOddQ"
      5: "SCENES.GridHexEvenQ"
    */
    /* Hex grid types refs https://www.redblobgames.com/grids/hexagons/#coordinates-offset */
    const isHorizontalHex = isHexGrid && [2, 3].includes(gridType);
    const isVerticalHex = isHexGrid && [4, 5].includes(gridType);;

    const { size, width, height } = gridLayer.grid.options.dimensions;
    const cellW = gridLayer.grid.w;
    const cellH = gridLayer.grid.h;
    const rowHeight = isHorizontalHex ? cellH * HEX_ROW_SIZE_MULTIPLIER : cellH;
    const colWidth = isVerticalHex ? cellW * HEX_ROW_SIZE_MULTIPLIER : cellW;
    const rows = Math.ceil(height / rowHeight);
    const cols = Math.ceil(width / colWidth);

    const getTextWithCoords = (row, col) => {
      let orderNumber = ""; //String(cols * row + col + 1);

      if(row < offsetY ) return undefined;
      if(col < offsetX ) return undefined;

      let R = row -1 - offsetY ;
      let C = col -1 - offsetX;


          if((R == 0) && (C>0))
          { orderNumber = String.fromCharCode("A".charCodeAt(0) + (C-1)); }
          if((C == 0) && (R>0))
          { orderNumber = "" + R; }
	
      const text = new PIXI.BitmapText(orderNumber, { fontName: 'GridFont', fontSize: size });
      const [xP, yP] = gridLayer.grid.getPixelsFromGridPosition(row, col);
      text.x = xP;
      text.y = yP;
      text.visible = true;
      return text;
    }

    const addHexCell = (row, col) => {
      const text = getTextWithCoords(row, col);
      if(text == undefined) return;
      text.x += size - text.width;
      textContainer.addChild(text)
    }

    const addSquareCell = (row, col) => {
      const text = getTextWithCoords(row, col);
      if(text == undefined) return;
      text.x += size - text.width;
      textContainer.addChild(text)
    }

    for (let col = 0; col <= cols; col++) {
      for (let row = 0; row <= rows; row++) {
        isHexGrid ? addHexCell(row, col) : addSquareCell(row, col)
      }
    }
    return textContainer;
  }

  set_display(status) {
    this.#display = status;
    if(this.#display) this.retrieve_offsets();
    this._draw();
  }

  toggle_display() {
    this.set_display(!this.#display)
  }

  moveGrid(x, y)
  {
    if(this.#display == false) return;
    this.#offset_x += x;
    this.#offset_y += y;
    game.scenes.current.setFlag('helyx-pbd-qol','offsets', {x: this.#offset_x, y : this.#offset_y});
    this._draw();
  }

  addGrid() {
    this.addChild(this.#drawn_elements)
  }
  removeGrid() {
    this.children = [];
  }

  draw() {
    return this._draw();
  }

  /** @override */
  async _draw() 
  {
    if(!this.#display) {
      if(this.#drawn_elements) {
        this.removeGrid();
      }
    }
    if(this.#display) {
      if(this.#drawn_elements) {
        this.removeGrid();
      } 
      this.#drawn_elements = this.getGridNumbersContainer(this.#offset_x, this.#offset_y);
      this.addGrid();
    }
    return this;
  
  }

  /** @override */
  async tearDown() {
    await super.tearDown();
    this.#drawn_elements = null;
    /**
    * FIXME:
    * Now we have a problem where GridNumbers layer can't
    * automatically update after changing grind settings or any other tearDown
    * beauce it doesn't know the Grid's properties in drawing time. 
    * So we handle this by disabling the grid after each grid change. 
    * This shold not happen frequently so its fine for now. 
    * But should be fixed in future
    **/
    this.#display = false;
    return this;
  }

  /**
   * Layer options
   * @type {CanvasLayerOptions}
  */
  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: 'GridNumbers',
      zIndex: 1001,
      sortActiveTop: false
    });
  }
}