const UMBRAL_DETECCION_POSIBLE_COLISION = 0.5;
const UMBRAL_ESTA_DELANTE = 0.1;
const MISMA_DIRECCION = 1;
const INCERTEZA_DIRECCION = 0.1;
const MAX_VELOCITY = 40;
const PRESS_ACCEL = 1;
const NOT_PRESS = 0;
const PRESS_BRAKE = 0.5;
const MINIMA_DISTANCIA_ENTRE_AUTOS = 10;
const UMBRAL_INICIO_TIPO_CALLE = 0.2;
const STREET_SIZE = 30;
const RIGHT = 0.48;
const LEFT = -0.351;
const STEER_RIGHT = 0.05;
const STEER_LEFT = -0.05;

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
        (!(elem.hasOwnProperty("carId")) ||  car.carId !== elem.carId) &&
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


const defineSideOfCurve = (carPosition, carDirection, street) => {
    return LEFT;
}

const round = (floatVal) => {
    const roundVal = Math.abs(floatVal) >= 0.5 ? Math.sign(floatVal) : 0;
    return roundVal;
}


const rectifyStraightDirection = (carDirection) => {
    const idealDirection = [round(carDirection.x), round(carDirection.y), round(carDirection.z)];
    if (Math.abs(idealDirection[0]) === 1){
        if(idealDirection[0] * (carDirection.z-idealDirection[2]) < 0){
            return STEER_RIGHT;
        }else if (idealDirection[0] * (carDirection.z - idealDirection[2]) > 0){
            return STEER_LEFT;
        }
        return 0;
    }else if (Math.abs(idealDirection[2]) === 1){
        if(idealDirection[2] * (carDirection.x-idealDirection[0]) < 0){
            return STEER_LEFT;
        }else if (idealDirection[2] * (carDirection.x - idealDirection[0]) > 0){
            return STEER_RIGHT;
        }
        return 0;
    }
    return 0;
}


const getStreetSteering = (car, streets) => {
    let street = null;
    for ( let i=0; i < streets.length; i++){
        if (
            car.position.x < (streets[i].position_x + (streets[i].long_y/2)) && car.position.x >= (streets[i].position_x - (streets[i].long_y/2)) &&
            car.position.z < (streets[i].position_y + (streets[i].long_x/2)) && car.position.z >= (streets[i].position_y - (streets[i].long_x/2))
        ){
            street = streets[i];
            break;
        }
    }
    if (street.type === "STRAIGHT"){
        console.log("RECTIFIER: ",rectifyStraightDirection(car.dirVector))
        return rectifyStraightDirection(car.dirVector);
    }
    const pos_z = car.position.z  % STREET_SIZE; 
    const pos_x = car.position.x  % STREET_SIZE; 

    if(pos_z < UMBRAL_INICIO_TIPO_CALLE || pos_x < UMBRAL_INICIO_TIPO_CALLE){
        const shouldTurn = Math.random() < 0.5;
        if (street.type !== "CURVE" && !shouldTurn){
            return 0;
        }
        let sideOfCurve = null;
        if (street.type === "INTERSECTION"){
            //Giro al azar
            sideOfCurve = Math.random() < 0.5 ? RIGHT : LEFT;
        }else{
            //Giro para el unico lado posible (Calle T o calle Curva).
            sideOfCurve = defineSideOfCurve(car.position, car.dirVector, street);
        }
        return sideOfCurve;
    }
    //Mantiene la rotacion hasta el final de la calle...
    return car.lastRotationWheel;

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
    }else{
        return {
            accelerate: NOT_PRESS, 
            brake: PRESS_BRAKE
        };
    }
}

onmessage = (message) => {
    //   Miro en que tipo de calle esta parado el auto (Puedo saberlo por la pos de la calle, y la pos del auto)
    //   Si es recta -> acelero o freno sin girar el volante
    //   Si es curva -> Giro segun la rotacion que tenga la calle y mi direccion
    //   Si es T o Interseccion -> Random de si giro o sigo derecho, y para que lado giro en caso de interseccion
    const { playersCar, trafficCars, streets } = message.data;
    const returnMessage = {};
    const compareCars = [...trafficCars];
    if (playersCar)
        compareCars.push(playersCar);
    trafficCars.forEach(car => {
        const {possibleColissions, frontCars} = filterCars(car, compareCars);
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