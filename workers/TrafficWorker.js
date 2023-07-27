onmessage = (message) => {
    postMessage({
        0: {
            accelerate: 1,
            brake: 0,
            deleteCar: false,
            steering: 0,
        }
    });
}