import React, { Component } from "react";
import * as THREE from "three";
import Camera from "../Camera/Camera";
import CarOffsetCamera from "../Camera/CarOffsetCamera";
import OrbitalCamera from "../Camera/OribtalCamera";
import CarModel from "../3DModels/CarModel";
import LogitechG29ControllerSingleton from "../LogicModel/ControllerMapping/LogitechG29Controller";
import XboxControllerSingleton from "../LogicModel/ControllerMapping/XboxController";
import Car from "../LogicModel/CarLogic/Car";
import AmmoInstance from "../LogicModel/Physics/AmmoInstance";
import { Vector3 } from "three";
import LevelFactory from "../Levels/LevelsFactory";
import { VRButton } from "../addons/VRbutton";
import Stats from "stats.js";
import TrafficModel from "../LogicModel/IA/TrafficModel";
import { useLocation } from "react-router-dom";
import { EndOfLevelModal } from "../Menus/Components/EndOfLevelModal";
import { PauseModal } from "../Menus/Components/PauseModal";


const MAXIMUM_DISTANCE_FROM_PLAYER_TO_RENDER = 200;
const SEGMENT_SIZE = 50;

export default function ThreeSceneWrapper(){
  const {state} = useLocation();
  const {jsonLevel} = state;

  return (
    <ThreeScene jsonLevel = {jsonLevel}/>
  );
}



const getTimeAsMs = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":");
  return parseInt(hours)*60*60*1000+parseInt(minutes)*60*1000+parseInt(seconds)*1000;
}

export class ThreeScene extends Component {

  constructor() {
    super();
    this.state = {
      currentRPM: 0,
      velocity: 0,
      currentShift: 0,
    };
    this.physicsToUpdate = [];
    localStorage.setItem("VR", false);
    this.gotAnyEvent = false;
    this.stats = new Stats();
    this.objectsToAnimate = [];
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      powerPreference: "high-performance",
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.clock = new THREE.Clock();
    this.finishedLevel = false;
    this.levelPaused = false;
    this.score = 0;
    this.time = 0;
  }

  async componentDidMount() {
    this.jsonLevel = this.props.jsonLevel;
    this.generateGeneralElements = this.generateGeneralElements.bind(this);
    this.animation = this.animation.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.generateEvents = this.generateEvents.bind(this);
    this.addPlayerCar = this.addPlayerCar.bind(this);
    this.generateLevel = this.generateLevel.bind(this);
    this.addVR = this.addVR.bind(this);
    this.endLevel = this.endLevel.bind(this);
    this.pauseLevel = this.pauseLevel.bind(this);
    await this.generateGeneralElements();
    await this.createAmmo();
    await this.addGeneralLights();
    await this.generateLevel();
    await this.addPlayerCar();
    if(this.jsonLevel["has_traffic"]){
      await this.createTraffic();
    }
    this.generateEvents();
    this.addVR();
    this.renderer.setAnimationLoop(this.animation);
  }

  componentWillUnmount() {
    this.renderer.setAnimationLoop(null);
    delete this.scene;
    delete this.objectsToAnimate;
    delete this.physicsToUpdate;
    delete this.physicsWorld;
    this.stats.dom.remove();
    delete this.stats;
    delete this.level;
    delete this.carLogic;
    delete this.carModel;
    delete this.trafficModel;
    delete this.jsonLevel;
    delete this.camera;
    document.getElementById("VRButton").remove();
    delete this.renderer;
  }

  async addVR() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    this.renderer.xr.setFramebufferScaleFactor(0.75);
    this.mount.appendChild(this.renderer.domElement);
    document.body.appendChild(VRButton.createButton(this.renderer));
  }

  async generateLevel() {
    this.level = new LevelFactory(this.scene, this.physicsWorld, this.endLevel);
    let updateDataLevel = await this.level.createLevelCustom(this.jsonLevel);
    this.objectsToAnimate = [
      ...this.objectsToAnimate,
      ...updateDataLevel.objectsToAnimate,
    ];
    this.physicsToUpdate = [
      ...this.physicsToUpdate,
      ...updateDataLevel.physicsToUpdate,
    ];
    const geomField = new THREE.BoxGeometry(10000, 10000);
    const texture = new THREE.TextureLoader().load("./textures/pasto.jpeg");
    texture.repeat.set(500, 500);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const matField = new THREE.MeshBasicMaterial({ map: texture });
    const meshField = new THREE.Mesh(geomField, matField);
    meshField.name = "GREEN_FIELD";
    meshField.position.set(0, -1, 0);
    meshField.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    this.scene.add(meshField);
  }

  async generateGeneralElements() {
    this.renderer.setClearColor(0x87cefa, 1);
    this.camera = new Camera(this.renderer);
    this.camera.addContainerToScene(this.scene);
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  async addGeneralLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  }

  async addPlayerCar() {
    this.carLogic = new Car(
      this.physicsWorld, 
      [this.jsonLevel.initial_position[0],1,this.jsonLevel.initial_position[1]], //Initial Position
      true, // Use Engine Audio
      new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.jsonLevel.initial_rotation ) // Initial Rotation
    );
    await this.carLogic.carPhysics.buildAmmoPhysics();
    let carModel = new CarModel();
    this.carLogic.carPhysics.rigidBody.threeObject = carModel;
    this.carLogic.attachObserver(carModel);
    this.carLogic.attachObserver(this.camera);
    this.objectsToAnimate.push(await carModel.addToScene(this.scene));
    this.carLogic.notifyObservers();
  }


  async createTraffic(){
    this.trafficModel = new TrafficModel(this.scene, this.physicsWorld, this.jsonLevel.streets);
    this.carLogic.attachObserver(this.trafficModel);
    await this.trafficModel.generateInitialTraffic();
  }

  generateEvents() {
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("gamepaddisconnected", function (e) {
      LogitechG29ControllerSingleton.removeInstance();
    });

    document.addEventListener(
      "keydown",
      (event) => {
        console.log(event.key);
        var keyPressed = event.key;
        if (!isNaN(keyPressed) && parseInt(keyPressed) >= 1 && parseInt(keyPressed) <= 5){
          console.log("ENTRE IF");
          this.carLogic.removeObserver(this.camera);
        }else{
          console.log("ELSE");
        }
        switch (keyPressed) {
          case "1":
            this.camera = new Camera(this.renderer);
            this.camera.addContainerToScene(this.scene);
            break;
          case "2":
            this.camera = new OrbitalCamera(this.renderer);
            break;
          case "3":
            this.camera = new CarOffsetCamera(new Vector3(-4.35, 0.6, -0.1));
            break;
          case "4":
            this.camera = new CarOffsetCamera(new Vector3(4.35, 0.6, -0.1));
            break;
          case "5":
            this.camera = new CarOffsetCamera(new Vector3(0.0, 3.0, -5.0));
            break;
          case "Escape":
            this.pauseLevel();
            break;
          default:
            break;
        }
        if (!isNaN(keyPressed) && parseInt(keyPressed) >= 1 && parseInt(keyPressed) <= 5){
          this.carLogic.attachObserver(this.camera);
          this.carLogic.notifyObservers();
        }
      },
      false
    );
  }

  async createAmmo() {
    let Ammo = await AmmoInstance.getInstance();
    this.tempTransform = new Ammo.btTransform();
    let collisionConfiguratation = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguratation);
    let overlappingPairCache = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();

    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguratation
    );
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

    const onEnterColission = Ammo.addFunction(async (cp, obj0, obj1) => {
      let Ammo = await AmmoInstance.getInstance();
      obj0 = Ammo.castObject(
        Ammo.wrapPointer(obj0, Ammo.btRigidBody),
        Ammo.btRigidBody
      );
      obj1 = Ammo.castObject(
        Ammo.wrapPointer(obj1, Ammo.btRigidBody),
        Ammo.btRigidBody
      );
      if (
        obj0.threeObject &&
        obj1.threeObject &&
        (obj0.threeObject.threeDModel.name === "driverCar" ||
          obj1.threeObject.threeDModel.name === "driverCar")
      ) {
        cp = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
        const userPersistentData = cp.get_m_userPersistentData();
        if (userPersistentData === 0) {
            obj0.onCollide ? obj0.onCollide() : obj1.onCollide();
            //Se cambia el contactId para denotar que la colision es constante. Para no restar puntos infinitamente.
            const collisionContactID = 1; 
            cp.set_m_userPersistentData(collisionContactID);
       }
      }
    });
    this.physicsWorld.setContactProcessedCallback(onEnterColission);
  }

  handleWindowResize() {
    this.camera.handleResize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera.getCameraInstance());
  }

  vecDistance(vectorA, vectorB){
    return vectorA.distanceTo(vectorB);
  }

  getMaxSizeStreets(){
    let maxX = 0, maxZ = 0;
    for (let i=0; i< this.jsonLevel.streets.length; i++){
      const street = this.jsonLevel.streets[i];
      if ( maxX < street.position_x + street.long_x/2 ) {
        maxX = street.position_x + street.long_x/2;
      }
      if ( maxZ < street.position_y + street.long_y/2 ) {
        maxZ = street.position_y + street.long_y/2;
      }
    }
    return [maxX, maxZ];
  }

  
  generateSegmentedScenesChildren(){
    const [maxX, maxZ] = this.getMaxSizeStreets();
    this.segmentedScenes = [];
    for (let i=0; i< parseInt(maxX/SEGMENT_SIZE) + 1; i++){
      this.segmentedScenes.push([]);
      for (let j=0; j<parseInt(maxZ/SEGMENT_SIZE) + 1; j++){
        const segmentPosition = new THREE.Vector3(
          i*SEGMENT_SIZE,
          0,
          j*SEGMENT_SIZE
        );
        this.segmentedScenes[i].push(this.scene.children.filter(
          object => object.isLight || 
                      object.name === "GREEN_FIELD" || 
                      object.name.includes("traffic_car") ||
                      object.name === "driverCar" ||
                      this.vecDistance(object.position, segmentPosition) <= MAXIMUM_DISTANCE_FROM_PLAYER_TO_RENDER
        ));
      }
    }
    
  }


  getReducedScene() {
    const cloneScene = new THREE.Scene();
    if(this.segmentedScenes.length === 0){
      this.generateSegmentedScenesChildren();
    }
    cloneScene.children = this.segmentedScenes
    [
      parseInt(this.lastPlayerPos.x/SEGMENT_SIZE)
    ]
    [
      parseInt(this.lastPlayerPos.z/SEGMENT_SIZE)
    ]
    return cloneScene;
  }

  animation() {
    this.stats.begin();
    if(!this.levelPaused){
      let deltaTime = this.clock.getDelta();
      this.physicsWorld.stepSimulation(deltaTime, 10);
      this.jsonLevel["has_traffic"] && this.trafficModel.animate();
      this.objectsToAnimate.forEach(function (object) {
        object.animate();
      });
      this.physicsToUpdate.forEach(function (phys) {
        phys.updatePhysics();
      });
      this.camera.setPositionRelativeToObject();
      XboxControllerSingleton.getInstance(this.carLogic, this.camera,this.pauseLevel).checkEvents();
      this.setState({
        ...this.state,
        velocity: this.carLogic.getSpeed(),
        currentRPM: this.carLogic.getCurrentRPM(),
        currentShift: this.carLogic.getCurrentShift(),
        score: this.level.getScore(),
        time: this.level.getTime()
      });
      // this.lastPlayerPos = this.carLogic.getDataToAnimate()["position"];
      // this.lastRenderScene = this.getReducedScene();
      // this.renderer.render(this.lastRenderScene, this.camera.getCameraInstance());
      this.renderer.render(this.scene, this.camera.getCameraInstance());
    }
    this.stats.end();
  }

  endLevel(score ,time){
    this.finishedLevel = true;
    this.score = score;
    this.time = time;
    this.setState({...this.state, endScore: score, endTime: time, finishedLevel: true});
  }

  pauseLevel(){
    this.levelPaused = !this.levelPaused ;
    this.setState({...this.state, paused: this.levelPaused});
  }

  

  render() {
    return (
      <div style={{ width: "100vw" }}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "red",
            width: "175px",
          }}
          id="Acelerador"
        >
          <p style={{ zIndex: 20, display: "float", fontWeight: "bold" }}>
            Cambio Actual: {parseInt(this.state.currentShift)}
          </p>
          <p style={{ zIndex: 20, display: "float", fontWeight: "bold" }}>
            Puntaje Actual: {this.state.score}
          </p>
          <p style={{ zIndex: 20, display: "float", fontWeight: "bold" }}>
            Tiempo Actual: {this.state.time}
          </p>
        </div>
        <div
          ref={(mount) => {
            this.mount = mount;
          }}
        ></div>
        
        <EndOfLevelModal 
          endLevel={this.state.finishedLevel ? this.state.finishedLevel : this.finishedLevel} 
          score={this.state.endScore} 
          time = {this.state.endTime}
          minScore={this.jsonLevel ? this.jsonLevel["minimum_to_win"] : 0}
          levelId={this.jsonLevel ? this.jsonLevel.id : undefined}
          timeInMs= {this.state.endTime ? getTimeAsMs( this.state.endTime) : 0}
        />

        <PauseModal
          pausedLevel={this.state.paused}
          pause={this.pauseLevel}
        />

      </div>
    );
  }
}
