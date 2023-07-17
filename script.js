document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    const slider = document.getElementById('grid-slider');
    const gridSizeLabel = document.getElementById('grid-size-label');
    const clearButton = document.getElementById('clear-button');
    const colorPalette = document.querySelectorAll('.color-box');
    const rainbowModeButton = document.getElementById('rainbow-mode-button');
    const undoButton = document.getElementById('undo-button');
    const redoButton = document.getElementById('redo-button');
  
    let gridSize = slider.value;
    let selectedColor = '#000'; // Default color
    let dragMode = true; // Drag mode as default
    let rainbowMode = false; // Rainbow mode disabled by default
    let drawingHistory = []; // Array to store drawing history
    let currentStep = -1; // Current position in drawing history (-1 means no action yet)
    let currentDrawingAction = null;
  
    // Function to create the grid
    function createGrid() {
      container.innerHTML = ''; // Clear the previous grid
      container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  
      // Create a new grid of divs
      for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement('div');
        div.classList.add('grid-square');
        container.appendChild(div);
      }
  
      gridSizeLabel.textContent = `${gridSize}x${gridSize}`;
    }
  
    // Function to handle coloring a square and save the change in drawing history
    function colorSquare(square) {
      if (dragMode) {
        if (rainbowMode) {
          const randomColor = getRandomRGBColor();
          square.style.backgroundColor = randomColor;
        } else {
          square.style.backgroundColor = selectedColor;
        }
  
        // Save the drawing state to history
        saveDrawingState();
      }
    }
  
    // Function to save the current drawing state to history
    function saveDrawingState() {
      const gridSquares = document.querySelectorAll('.grid-square');
      const drawingState = [];
      gridSquares.forEach(square => {
        drawingState.push(square.style.backgroundColor);
      });
      drawingHistory.push([...drawingState]); // Create a copy of the drawingState array
      currentStep++;
    }
  
    // Function to undo the last drawing action
    function undoDrawing() {
      if (currentStep > 0) {
        currentStep--;
        const drawingState = drawingHistory[currentStep];
        const gridSquares = document.querySelectorAll('.grid-square');
        gridSquares.forEach((square, index) => {
          square.style.backgroundColor = drawingState[index];
        });
      }
    }
  
    // Function to redo the last undone drawing action
    function redoDrawing() {
      if (currentStep < drawingHistory.length - 1) {
        currentStep++;
        const drawingState = drawingHistory[currentStep];
        const gridSquares = document.querySelectorAll('.grid-square');
        gridSquares.forEach((square, index) => {
          square.style.backgroundColor = drawingState[index];
        });
      }
    }
  
    // Initial grid creation
    createGrid();
  
    // Event listener for slider change
    slider.addEventListener('input', () => {
      gridSize = slider.value;
      createGrid();
    });
  
    // Event listener for clear button
    clearButton.addEventListener('click', () => {
      const gridSquares = document.querySelectorAll('.grid-square');
      gridSquares.forEach(square => {
        square.style.backgroundColor = '#dddddd'; // Set default color
        square.classList.remove('colored'); // Remove the colored class
      });
    });
  
    // Event listener for color selection
    colorPalette.forEach(box => {
      box.addEventListener('click', () => {
        selectedColor = box.style.backgroundColor;
        rainbowMode = false; // Turn off rainbow mode
        rainbowModeButton.textContent = 'Rainbow Mode'; // Update the button text
        container.removeEventListener('mousemove', rainbowModeHandler); // Disable rainbow mode
      });
    });
  
    // Event listener for undo button
    undoButton.addEventListener('click', () => {
      undoDrawing();
    });
  
    // Event listener for redo button
    redoButton.addEventListener('click', () => {
      redoDrawing();
    });
  
    // Event listener for the entire document to handle dragging
    container.addEventListener('mousedown', (event) => {
      // Initialize the current drawing action with an empty array
      currentDrawingAction = [];
  
      // Call the colorSquare function to perform the first drawing action
      colorSquare(event.target);
      container.addEventListener('mouseover', mouseOverHandler);
    });
  
    container.addEventListener('mouseup', () => {
      // Remove the mouseover event listener when the mouse is released
      container.removeEventListener('mouseover', mouseOverHandler);
  
      // Check if there are any changes made during dragging
      if (currentDrawingAction.length > 0) {
        // Push the current drawing action to the undo stack
        undoStack.push([...currentDrawingAction]);
      }
  
      // Reset the current drawing action variable
      currentDrawingAction = null;
    });
  
    // Event handler for mouseover while dragging
    function mouseOverHandler(event) {
      // Call the colorSquare function to perform the drawing action
      colorSquare(event.target);
  
      // Add the drawing action to the currentDrawingAction array
      currentDrawingAction.push({
        square: event.target,
        prevColor: event.target.style.backgroundColor,
        newColor: event.target.style.backgroundColor,
      });
    }
  
    rainbowModeButton.addEventListener('click', () => {
      rainbowMode = !rainbowMode; // Toggle the rainbow mode
      if (rainbowMode) {
        rainbowModeButton.textContent = 'Exit Rainbow'; // Update the button text
        container.addEventListener('mouseenter', enableRainbowMode);
        container.addEventListener('mouseleave', disableRainbowMode);
      } else {
        rainbowModeButton.textContent = 'Rainbow Mode'; // Update the button text
        container.removeEventListener('mouseenter', enableRainbowMode);
        container.removeEventListener('mouseleave', disableRainbowMode);
      }
    });
  
    // Function to enable rainbow mode
    function enableRainbowMode() {
      container.addEventListener('mousemove', rainbowModeHandler);
    }
  
    // Function to disable rainbow mode
    function disableRainbowMode() {
      container.removeEventListener('mousemove', rainbowModeHandler);
    }
  
    // Function to handle rainbow mode effect
    function rainbowModeHandler(event) {
      if (dragMode && event.buttons === 1) {
        // In rainbow mode, find the grid square under the mouse and change its color
        const gridSquares = document.querySelectorAll('.grid-square');
        gridSquares.forEach(square => {
          const rect = square.getBoundingClientRect();
          if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
          ) {
            const randomColor = getRandomRGBColor();
            colorSquare(square, randomColor);
          }
        });
      }
    }
  
    // Function to generate a random RGB color
    function getRandomRGBColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    }
  });
  