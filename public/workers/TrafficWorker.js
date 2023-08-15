const UMBRAL_DETECCION_POSIBLE_COLISION = 0.5;
const UMBRAL_ESTA_DELANTE = 0.1;
const MISMA_DIRECCION = 1;
const INCERTEZA_DIRECCION = 0.1;
const MAX_VELOCITY = 40;
const PRESS_ACCEL = 1;
const NOT_PRESS = 0;
const PRESS_BRAKE = 0.5;
const MINIMA_DISTANCIA_ENTRE_AUTOS = 10;
const UMBRAL_INICIO_TIPO_CALLE = 0.3;
const STREET_SIZE = 30;
const RIGHT = 0.48;
const LEFT = -0.351;
const STEER_RIGHT = 0.03;
const STEER_LEFT = -0.03;
const UMBRAL_ACOMODAR_CARRIL = 0.2;
const CARRIL_OFFSET = 2.5;
const DISTANCIA_CENTRO_FRENTE_AUTO = 2.5;


const ROTATIONS_FOR_CURVE = {
    0: {
        "0,0,1" : RIGHT,
        "1,0,0" : LEFT
    },
    [Math.PI/2]: {
        "0,0,-1" : LEFT,
        "1,0,0": RIGHT
    },
    [Math.PI]: {
        "0,0,-1" : RIGHT,
        "-1,0,0" : LEFT
    },
    [Math.PI*3/2]: {
        "0,0,1" : LEFT,
        "-1,0,0" : RIGHT
    }
}


const ROTATIONS_FOR_T_STREET = {
    0: {
        "0,0,1" : RIGHT,
        "0,0,-1" : LEFT
    },
    [Math.PI/2]: {
        "1,0,0" : RIGHT,
        "-1,0,0": LEFT
    },
    [Math.PI]: {
        "0,0,1" : LEFT,
        "0,0,-1" : RIGHT
    },
    [Math.PI*3/2]: {
        "1,0,0" : LEFT,
        "-1,0,0" : RIGHT
    }
}


const SHOULD_ROTATE_T_STREET = {
    0: {
        "1,0,0" : "RANDOM",
    },
    [Math.PI/2]: {
        "0,0,-1": "RANDOM"
    },
    [Math.PI]: {
        "-1,0,0" : "RANDOM"
    },
    [Math.PI*3/2]: {
        "0,0,1" : "RANDOM"
    }
}

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
    const possibleColissions = nearCars.filter(elem => {
        const arcCos = productoEscalar(elem.dirVector, car.dirVector);
        return (
            arcCos <= UMBRAL_DETECCION_POSIBLE_COLISION &&
                arcCos >= 0
        );
    });
    const frontCars = nearCars.filter(elem => {
        const arcCos = productoEscalar(elem.dirVector, car.dirVector);
        return(
            (
                car.dirVector.x * (elem.position.x - car.position.x) > INCERTEZA_DIRECCION || 
                    car.dirVector.z * (elem.position.z - car.position.z) > INCERTEZA_DIRECCION
            ) &&
            arcCos <= MISMA_DIRECCION + UMBRAL_ESTA_DELANTE &&
            arcCos >= MISMA_DIRECCION - UMBRAL_ESTA_DELANTE 
        );
    });
    return {
        possibleColissions,
        frontCars
    };
}


const defineSideOfCurve = (carPosition, carDirection, street) => {
    const idealDirection = [round(carDirection.x), round(carDirection.y), round(carDirection.z)];
    if (street.type === "CURVE"){
        const rotationToDo = ROTATIONS_FOR_CURVE[street.rotation][`${idealDirection[0]},${idealDirection[1]},${idealDirection[2]}`];
        return rotationToDo ? rotationToDo : 0;
    }
    if (street.type === "T_STREET"){
        const rotationToDo = ROTATIONS_FOR_T_STREET[street.rotation][`${idealDirection[0]},${idealDirection[1]},${idealDirection[2]}`];
        return rotationToDo ? rotationToDo : 0;
    }
    return RIGHT;
}

const round = (floatVal) => {
    const roundVal = Math.abs(floatVal) >= 0.5 ? Math.sign(floatVal) : 0;
    return roundVal;
}


const rectifyStraightDirection = (carDirection, carPos, streetPos) => {
    const idealDirection = [round(carDirection.x), round(carDirection.y), round(carDirection.z)];
    //Posicion con Offset para tomar la trompa del auto y no el centro como tal (Permite ajustar mejor la dirección).
    const frontCarPos = {
        x: carPos.x + carDirection.x * DISTANCIA_CENTRO_FRENTE_AUTO,
        y: carPos.y,
        z: carPos.z + carDirection.z * DISTANCIA_CENTRO_FRENTE_AUTO
    };
    if (Math.abs(idealDirection[0]) === 1){
        //Va transitando en eje Z, acomoda el eje X y se posiciona al centro del carril
        const sideMoveWithSign = CARRIL_OFFSET * idealDirection[0];
        const sign = ((streetPos.z + sideMoveWithSign) - frontCarPos.z) * idealDirection[0];
        return sign * ((((streetPos.z + sideMoveWithSign) - frontCarPos.z) * idealDirection[0] / CARRIL_OFFSET)**2);
    }else if (Math.abs(idealDirection[2]) === 1){
        //Va transitando en eje X, acomoda el eje Z y se posiciona al centro del carril
        const sideMoveWithSign = CARRIL_OFFSET * idealDirection[2];
        const sign = Math.sign((frontCarPos.x - (streetPos.x - sideMoveWithSign))* idealDirection[2])
        return sign * (((frontCarPos.x - (streetPos.x - sideMoveWithSign)) * idealDirection[2] / CARRIL_OFFSET)**2);
    }
    //Si está perfectamente alineado, no debe rotar.
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
    console.log("sel street: ", street, car);
    if (street.type === "STRAIGHT"){
        const streetPos = {x:street.position_x, y:0, z:street.position_y};
        return rectifyStraightDirection(car.dirVector, car.position, streetPos);
    }
    const pos_z = car.position.z  % STREET_SIZE; 
    const pos_x = car.position.x  % STREET_SIZE; 

    if(
        pos_z <= UMBRAL_INICIO_TIPO_CALLE || pos_x <= UMBRAL_INICIO_TIPO_CALLE ||
        pos_z >= STREET_SIZE - UMBRAL_INICIO_TIPO_CALLE || pos_x >= STREET_SIZE - UMBRAL_INICIO_TIPO_CALLE

    ){
        const shouldTurn = Math.random() < 0.5;
        if (street.type === "T_STREET"){
            const idealDirection = [round(car.dirVector.x), round(car.dirVector.y), round(car.dirVector.z)];
            const stringDir = `${idealDirection[0]},${idealDirection[1]},${idealDirection[2]}`;
            //Debe rotar si o si para alguno de los 2 lados
            if(SHOULD_ROTATE_T_STREET[street.rotation][stringDir]){
                return Math.random() < 0.5 ? RIGHT : LEFT;
            }
        }
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