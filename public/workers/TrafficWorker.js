const UMBRAL_DETECCION_POSIBLE_COLISION = 0.5;
const UMBRAL_ESTA_DELANTE = 0.1;
const MISMA_DIRECCION = 1;
const INCERTEZA_DIRECCION = 0.1;
const MAX_VELOCITY = 40;
const PRESS_ACCEL = 1;
const NOT_PRESS = 0;
const PRESS_BRAKE = 0.5;
const MINIMA_DISTANCIA_ENTRE_AUTOS = 10;

const productoVectorial = (vectorA,vectorB) => {
    
        const a1 = vectorA.x;
        const a2 = vectorA.y;
        const a3 = vectorA.z;
      
        const b1 = vectorB.x;
        const b2 = vectorB.y;
        const b3 = vectorB.z;
      
        const resultX = a2 * b3 - a3 * b2;
        const resultY = a3 * b1 - a1 * b3;
        const resultZ = a1 * b2 - a2 * b1;
      
        return [resultX, resultY, resultZ];
}


const productoEscalar = (vectorA, vectorB) => {
    return (
        vectorA.x * vectorB.x +
            vectorA.y * vectorB.y +
            vectorA.z * vectorB.z
    )
}


const distanciaVectorial = (vectorA, vectorB) => {
    return Math.sqrt((vectorA.x - vectorB.x) ** 2 + (vectorA.y - vectorB.y) ** 2 + (vectorA.z - vectorB.z) ** 2);
}


const filterCars = (car, trafficCars) => {
    const nearCars = trafficCars.filter(elem => (
        car.carId !== elem.carId &&
        distanciaVectorial(elem.position, car.position) <= 15)
    );
    const possibleColissions = nearCars.filter(elem => (
        Math.abs(productoEscalar(elem.dirVector, car.dirVector)) <= UMBRAL_DETECCION_POSIBLE_COLISION
    ));
    const frontCars = nearCars.filter(elem => (
        (
            car.dirVector.x * (elem.position.x - car.position.x) > INCERTEZA_DIRECCION || 
                car.dirVector.z * (elem.position.z - car.position.z) > INCERTEZA_DIRECCION
        ) &&
        Math.abs(productoEscalar(elem.dirVector, car.dirVector)) <= MISMA_DIRECCION + UMBRAL_ESTA_DELANTE &&
        Math.abs(productoEscalar(elem.dirVector, car.dirVector)) >= MISMA_DIRECCION - UMBRAL_ESTA_DELANTE
    ));
    return {
        possibleColissions,
        frontCars
    };
}

const getStreetSteering = (car, streets) => {
    return 0;
}

const getAccelerationBasedOnFrontCars = (car, frontCars) => {
    if (frontCars.length === 0 && car.velocity < MAX_VELOCITY){
        return {
            accelerate: PRESS_ACCEL, 
            brake: NOT_PRESS
        };
    }else if(frontCars.length > 0){
        const mostNearCar = frontCars.reduce((elem, current) => {
            return (
                distanciaVectorial(elem.position, car.position)
                <
                distanciaVectorial(current.position, car.position)
                ?
                elem
                :
                current
            );
        });
        if (mostNearCar.velocity > car.velocity && distanciaVectorial(mostNearCar.position, car.position) > MINIMA_DISTANCIA_ENTRE_AUTOS){
            return {
                accelerate: PRESS_ACCEL, 
                brake: NOT_PRESS
            };
        }else{
            return {
                accelerate: NOT_PRESS,
                brake: PRESS_BRAKE
            };
        }
    }
}

onmessage = (message) => {
    //   Miro en que tipo de calle esta parado el auto (Puedo saberlo por la pos de la calle, y la pos del auto)
    //   Si es recta -> acelero o freno sin girar el volante
    //   Si es curva -> Giro segun la rotacion que tenga la calle y mi direccion
    //   Si es T o Interseccion -> Random de si giro o sigo derecho, y para que lado giro en caso de interseccion
    const { playersCar, trafficCars, streets } = message.data;
    const returnMessage = {};
    trafficCars.forEach(car => {
        const {possibleColissions, frontCars} = filterCars(car, trafficCars);
        const steering = getStreetSteering(car, streets);
        if(possibleColissions.length > 0){
            //Freno por posibilidad de colision
            returnMessage[car.carId] = {
                accelerate: NOT_PRESS,
                brake: PRESS_BRAKE,
                deleteCar: false,
                steering
            }
        }else{
            //Puedo seguir pero con mi velocidad nivelada con el mas cercano de adelante
            const {accelerate, brake} = getAccelerationBasedOnFrontCars(car, frontCars);
            returnMessage[car.carId] = {
                accelerate,
                brake,
                deleteCar: false,
                steering
            };
        }
        
        
    });

    postMessage(returnMessage);
}