document.addEventListener("DOMContentLoaded", function(){

  let grid = document.getElementById("main");
  let palette = document.querySelector(".palette_case");
  let colors = ["Aquamarine","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Green","GreenYellow","HotPink","IndianRed","Indigo","Khaki","Lavender","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","NavajoWhite","Navy","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","Yellow","YellowGreen"];
  let colorSelected = "Aquamarine";
  let selector = document.querySelector('.selector');
  let indicator = document.querySelector('.indicator');
  let save = document.querySelector('.save');
  let load = document.querySelector('.load');
  let mouseDown = false;
  let fillOn = false;

//default indicator to colorSelected value
  indicator.style.backgroundColor = colorSelected;

//add event listener for clicking save button... stringify and store colors of grid divs
  save.addEventListener('click',function(){
    let gridColors = [];
    for (var b = 0; b<grid.children.length; b++) {
      gridColors.push(grid.children[b].style.backgroundColor);
    }
    localStorage.setItem("savedPicture",JSON.stringify(gridColors));
  });

//add event listener for clicking load button... parse and load stored colors of grid divs
  load.addEventListener('click',function(){
    if (localStorage["savedPicture"]) {
      gridColors = JSON.parse(localStorage.getItem("savedPicture"));
      for (let c = 0; c<gridColors.length; c++) {
        grid.children[c].style.backgroundColor = gridColors[c];
      }
    }
  });

//add event listener for changing color using color selector... update colorSelected variable and update indicator
  selector.addEventListener('change',function(){
    colorSelected = event.target.value;
    document.querySelector('.indicator').style.backgroundColor = colorSelected;
  });

//add event listener for mousedown event... update mouseDown variable to true
  document.addEventListener('mousedown',function(){
    mouseDown = true;
  });

//add event listener for mouseup event... update mouseDown variable to false
  document.addEventListener('mouseup',function(){
    mouseDown = false;
  });

//add event listener for fill button... update fillOn variable, add highlight to fill button, remove highlight from draw button
  document.querySelector('.fill').addEventListener('click',function(){
    fillOn = true;
    this.style.border = "2px solid blue";
    document.querySelector('.draw').style.border = '1px solid black';
  });

//add event listener for draw button... update fillOn variable, add highlight to draw button, remove highlight from fill button
  document.querySelector('.draw').addEventListener('click',function(){
    fillOn = false;
    this.style.border = "2px solid blue";
    document.querySelector('.fill').style.border = '1px solid black';
  });

//define function to create each canvas div
  function createDiv(strClass) {
    //create new div element with class defined by argument
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class',strClass);
    //add event listener to update background color when mouseover event occurs
    newDiv.addEventListener('mouseover', function(){
      if (mouseDown) {
        newDiv.style.backgroundColor = colorSelected;
      };
    });
    //add click event listener to div
    newDiv.addEventListener('click',function(){
      //check to see if fillOn variable is on (if fill button has been clicked)
      //if so, call floodFill function... if not, simply update the background color to value of colorSelected
      if (fillOn) {
        let currColor = this.style.backgroundColor;
        let nodeIndex;
        for (var i = 0; i<grid.children.length; i++){
          if(grid.children[i] === this){
            nodeIndex = i;
          }
        }
        floodFill(nodeIndex,currColor,colorSelected);
      };
      newDiv.style.backgroundColor = colorSelected;
    });
    //add event listener for clear button that updates each div's background color to white when clear button is clicked
    document.getElementById('clear').addEventListener('click', function (){
      newDiv.style.backgroundColor = 'white';
    });
    return newDiv;
  };

//define function to create paint color palette with class and background color of color provided by argument
  function setColor (divColor) {
    let newColor = document.createElement('div');
    newColor.setAttribute('class','palette');
    newColor.style.backgroundColor = divColor;
    //add event listener to update colorSelected variable when palette div is clicked
    newColor.addEventListener("click",function(){
      indicator.style.backgroundColor = divColor;
      colorSelected = divColor;
    });
    return newColor;
  };

//loop to create each canvas div
  for (var i = 0; i<6700; i++) {
    let gridDiv = createDiv('grid');
    grid.appendChild(gridDiv);
  }
//loop to create each palette div... each element in color array provided to setColor function as an argument
  for (var i = 0; i<colors.length; i++) {
    let colorDiv = setColor(colors[i]);
    palette.appendChild(colorDiv);
  }

//define function to fill palette divs when enclosed by divs of same color
  function floodFill (nodeIndex, targetColor, newColor) {
    //return if the div has a background color that matches the colorSelected variable
    if (grid.children[nodeIndex].style.backgroundColor === newColor) {
      return;
    //return if the div has a background color that is different than the background color of the orginal div clicked
    } else if (grid.children[nodeIndex].style.backgroundColor !== targetColor) {
      return;
    //update the background color of the div and check all applicable divs around the div
    } else {

      grid.children[nodeIndex].style.backgroundColor = newColor;

      if ((nodeIndex - 99) % 100 !== 0){
        floodFill(nodeIndex+1,targetColor,newColor);
      };
      if (nodeIndex % 100 !== 0) {
        floodFill(nodeIndex-1,targetColor, newColor);
      };
      if (nodeIndex >= 100) {
        floodFill(nodeIndex-100, targetColor,newColor);
      };
      if (nodeIndex < 6600){
        floodFill(nodeIndex+100, targetColor,newColor);
      };
    }
    return;
  }

  return grid;
  return palette;

});
