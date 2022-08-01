// Grab my canvas element and make it as long as the window, and thin
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Get Canvas context to create drawings on it
const ctx = canvas.getContext("2d");

// Set up car's starting lane and road's number of lanes
const startingLane = 1;
const laneCount = 3;

// Check starting lane isn't ">" number of lanes, otherwise start on last lane
// startingLane = Math.min(startingLane, laneCount - 1);
if (startingLane >= laneCount) {
    alert("StartingLane value is too")
}

// Create and draw the road object
const road = new Road(canvas.width/2, canvas.width*0.9, laneCount);

// Create and draw the car object
const x = road.getLaneCenter(startingLane);
const car = new Car(x, 400, 30, 50);

// Animation and drawing
animate();

function animate() {
    car.update();
    canvas.height = window.innerHeight;
    road.draw(ctx)
    car.draw(ctx);
    requestAnimationFrame(animate);
}