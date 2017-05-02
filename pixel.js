document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('main');
  const palette = document.querySelector('.palette_case');
  const colors = ['Aquamarine', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGrey', 'DodgerBlue', 'FireBrick', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'Gold', 'GoldenRod', 'Gray', 'Green', 'GreenYellow', 'HotPink', 'IndianRed', 'Indigo', 'Khaki', 'Lavender', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'NavajoWhite', 'Navy', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'Yellow', 'YellowGreen'];
  let colorSelected = 'Aquamarine';
  const selector = document.querySelector('.selector');
  const indicator = document.querySelector('.indicator');
  const save = document.querySelector('.save');
  const load = document.querySelector('.load');
  let mouseDown = false;
  let fillOn = false;

  // default indicator to colorSelected value
  indicator.style.backgroundColor = colorSelected;

  // add event listener for clicking save button... stringify and store colors of grid divs
  save.addEventListener('click', () => {
    const gridColors = [];
    for (let b = 0; b < grid.children.length; b++) {
      gridColors.push(grid.children[b].style.backgroundColor);
    }
    localStorage.setItem('savedPicture', JSON.stringify(gridColors));
  });

  // add event listener for clicking load button... parse and load stored colors of grid divs
  load.addEventListener('click', () => {
    if (localStorage.savedPicture) {
      const gridColors = JSON.parse(localStorage.getItem('savedPicture'));
      for (let c = 0; c < gridColors.length; c++) {
        grid.children[c].style.backgroundColor = gridColors[c];
      }
    }
  });

  // add event listener for changing color using color selector
  selector.addEventListener('change', () => {
    colorSelected = event.target.value;
    document.querySelector('.indicator').style.backgroundColor = colorSelected;
  });

  // add event listener for mousedown event... update mouseDown variable to true
  document.addEventListener('mousedown', () => {
    mouseDown = true;
  });

  // add event listener for mouseup event... update mouseDown variable to false
  document.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  // add event listener for fill button
  document.querySelector('.fill').addEventListener('click', () => {
    fillOn = true;
    document.querySelector('.fill').style.border = '2px solid blue';
    document.querySelector('.draw').style.border = '1px solid black';
  });

  // add event listener for draw button
  document.querySelector('.draw').addEventListener('click', () => {
    fillOn = false;
    document.querySelector('.draw').style.border = '2px solid blue';
    document.querySelector('.fill').style.border = '1px solid black';
  });

  function floodFill(nodeIndex, targetColor, newColor) {
    // return if the div has a background color that matches the colorSelected variable
    if (grid.children[nodeIndex].style.backgroundColor === newColor) {
      return;
      // return if the div has a background color that is different than the orig div
    } else if (grid.children[nodeIndex].style.backgroundColor !== targetColor) {
      return;
      // update the background color of the div and check all applicable divs around the div
    }

    grid.children[nodeIndex].style.backgroundColor = newColor;

    if ((nodeIndex - 99) % 100 !== 0) {
      floodFill(nodeIndex + 1, targetColor, newColor);
    }
    if (nodeIndex % 100 !== 0) {
      floodFill(nodeIndex - 1, targetColor, newColor);
    }
    if (nodeIndex >= 100) {
      floodFill(nodeIndex - 100, targetColor, newColor);
    }
    if (nodeIndex < 6600) {
      floodFill(nodeIndex + 100, targetColor, newColor);
    }
  }

  function createDiv(strClass) {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', strClass);

    newDiv.addEventListener('mouseover', () => {
      if (mouseDown) {
        newDiv.style.backgroundColor = colorSelected;
      }
    });

    newDiv.addEventListener('click', () => {
      if (fillOn) {
        const currColor = newDiv.style.backgroundColor;
        let nodeIndex;
        for (let i = 0; i < grid.children.length; i++) {
          if (grid.children[i] === newDiv) {
            nodeIndex = i;
          }
        }
        floodFill(nodeIndex, currColor, colorSelected);
      }
      newDiv.style.backgroundColor = colorSelected;
    });

    document.getElementById('clear').addEventListener('click', () => {
      newDiv.style.backgroundColor = 'white';
    });

    return newDiv;
  }


  function setColor(divColor) {
    const newColor = document.createElement('div');
    newColor.setAttribute('class', 'palette');
    newColor.style.backgroundColor = divColor;
    // add event listener to update colorSelected variable when palette div is clicked
    newColor.addEventListener('click', () => {
      indicator.style.backgroundColor = divColor;
      colorSelected = divColor;
    });
    return newColor;
  }

  for (let i = 0; i < 6700; i++) {
    const gridDiv = createDiv('grid');
    grid.appendChild(gridDiv);
  }

  for (let i = 0; i < colors.length; i++) {
    const colorDiv = setColor(colors[i]);
    palette.appendChild(colorDiv);
  }

  return grid;
  return palette;
});
