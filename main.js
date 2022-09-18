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
    alert("StartingLane value is too high")
}

// Create and draw the road object
const road = new Road(carCanvas.width/2, carCanvas.width*0.9, laneCount);

// Create and draw the car object
const x = road.getLaneCenter(startingLane);

const N = 2000;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    bestCar.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    );
}

const traffic = [
    new Car(x, 100, 30, 50, "DUMMY", 2)
]
// Animation and drawing
animate();

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));

}

function remove(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1; i<=N; i++){
        cars.push(new Car(x, 400, 30, 50, "AI"))
    }
    return cars;
}

function animate() {
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    if(!localStorage.getItem("bestBrain")){
        bestCar = cars.find(
            c=>c.y==Math.min(...cars.map(c=>c.y))
            )
    }
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // Move the road, so it looks like the car has a camera above it
    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "black");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "black", true);

    carCtx.restore();

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}