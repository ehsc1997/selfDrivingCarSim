// Grab my canvas element and make it as long as the window, and thin
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Get Canvas context to create drawings on it
const ctx = canvas.getContext("2d");

// Create and draw the car object
const car = new Car(100, 100, 30, 50);
car.draw(ctx);

animate();

function animate() {
    car.update();
    canvas.height = window.innerHeight;
    car.draw(ctx);
    requestAnimationFrame(animate);
}