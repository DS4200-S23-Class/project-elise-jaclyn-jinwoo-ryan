// left column

// Create list of points
let points = document.getElementsByTagName("circle");

// loop to make second click unavaible 
for (let i = 0; i < points.length; i++) {
    
    // check each point for clicks
    let point = points[i];
    point.addEventListener("click", function(){

                  // click then add border
                  this.classList.toggle("Border");

                  //find the cx and cy
                  let cx = this.getAttribute("cx") / 50;
                  let cy = (500 - this.getAttribute("cy")) / 50;

                  // create new text
                  let text1 = "Last point clicked: "
                  let text2 = "(" + cx +"," + cy + ")"
  
                  // show the text information
                  document.getElementById("text1").innerHTML = text1;
                  document.getElementById("text2").innerHTML = text2;
}
)}

// right column

// connect botton to the reaction
let pointButton =  document.getElementById("subButton");
pointButton.addEventListener("click", function(){

    // 1. locate to the html file first to get the input
    // 2. then transfer value which would show on the graph
    // 3. Identify the same frame
    // 4. continue what we did to the left column

    // get the user's input
    let xInput = document.getElementById("cx1");
    let yInput = document.getElementById("cy1");


    // get the values from the user selections
    let cx1 = xInput.value;
    let cy1 = yInput.value;

    // convert value to 50base to the graph
    let x = cx1 * 50;
    let y = 500 - (cy1 * 50);

    // using the same frame with the graph
    let frame = document.getElementById("frame");

    // add a circle to the html
    let circleStr = '<circle cx="' + x + '" cy="' + y + '" r="10"/>';
    frame.innerHTML += circleStr;

    let points = document.getElementsByTagName("circle");

    // loop through all points
    for (let i = 0; i < points.length; i++) {
        
        // check each point for clicks
        let point = points[i];
        point.addEventListener("click", function(){

                  // click then add border
                  this.classList.toggle("Border");

                  //find the cx and cy
                  let cx = this.getAttribute("cx") / 50;
                  let cy = (500 - this.getAttribute("cy")) / 50;

                  // create new text
                  let text1 = "Last point clicked: "
                  let text2 = "(" + cx +"," + cy + ")"
  
                  // show the text information
                  document.getElementById("text1").innerHTML = text1;
                  document.getElementById("text2").innerHTML = text2;

    })}
    }
    )

