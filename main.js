// Grab my canvas element and make it as long as the window, and thin
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// Get Canvas context to create drawings on it
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Set up car's starting lane and road's number of lanes
const startingLane = 1;
const laneCount = 3;

// Check starting lane isn't ">" number of lanes, otherwise start on last lane
// startingLane = Math.min(startingLane, laneCount - 1);
if (startingLane >= laneCount) {
    alert("StartingLane value is too")
}

// Create and draw the road object
const road = new Road(carCanvas.width/2, carCanvas.width*0.9, laneCount);

// Create and draw the car object
const x = road.getLaneCenter(startingLane);
const car = new Car(x, 400, 30, 50, "AI");
const traffic = [
    new Car(x, 100, 30, 50, "DUMMY", 2)
]
// Animation and drawing
animate();

function animate() {
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // Move the road, so it looks like the car has a camera above it
    carCtx.save();
    carCtx.translate(0, -car.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    car.draw(carCtx, "black");

    carCtx.restore();

    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}