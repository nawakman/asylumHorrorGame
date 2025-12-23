import { Scene, BoxGeometry, MeshPhongMaterial, PointLight, Mesh, SpotLight, MathUtils, CubeTextureLoader } from 'three'//https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {LoadAssets,LoadAnimatedAssets} from './content/data/modelLoader'
import { AnimationManager } from './content/blueprints/animationManager'
import {GraphicsManager} from './content/data/graphicsManager'
import {World} from './content/data/world'
import {CustomCamera} from './content/blueprints/customCamera'
import {CustomControls} from './content/data/customControls.js'
import {CustomLight} from './content/blueprints/customLight'
import { Graph } from './content/data/graph'
import { ButtonInteraction } from './content/data/buttonInteraction'

const scene = new Scene()
const world=new World()
const framerate=75//CHANGES THE PROJECT FRAMERATE
const camera = new CustomCamera(framerate)

//const grogu=await LoadAssets('./grogu3dBaked.glb')//textures are bundled within the file too //public acts as the "resources" folder
//world.AddMeshes(grogu.visuals)

/*//DOOR TEST
const door=await LoadAssets('./testWallDoor3.glb')
world.AddMeshes(door.visuals)
world.AddInteractions(door.visuals,camera)
*/

/*//ANIMATION CODE
const testAnim= await LoadAnimatedAssets('./winnieGangnam.glb')
scene.add(testAnim)
const animManager= new AnimationManager(testAnim)
animManager.LoadAnimation('Armature.001|mixamo.com|Layer0',false)
animManager.PlayAnimation('Armature.001|mixamo.com|Layer0')
*/

//TEST ROOM
const asylum=await LoadAssets('./asylum.glb ')
world.AddMeshes(asylum.visuals)
world.AddInteractions(asylum.visuals,camera)
Graph.MakeGraph(asylum.visuals)
//console.log(Graph.GetRoom(Graph.GetAdjacentArrows("Corridor1")[1].toRoom).position)

Graph.GetAdjacentArrows("Corridor1")[1].interact()
//Graph.HighLightPath("Blue","White")



/*//SIMPLE CUBE
const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshPhongMaterial()
const mesh = new Mesh(geometry, material)
mesh.position.set(2,0,0)
scene.add(mesh)
*/

const light = new CustomLight()
scene.add(light)

/*//FLASHLIGHT CODE
const spotlight =new SpotLight(0xffffff,1,10,MathUtils.degToRad(20),0.5,0.9)//color,intesnsity,distance,coneAngle,penumbra,decay
camera.add(spotlight)
camera.add(spotlight.target)
spotlight.target.position.z=-3
scene.add(camera)
*/

//SKYBOX
const loader = new CubeTextureLoader();
loader.setPath( 'skybox/night/' );

const textureCube = loader.load([
  'px.png', 'nx.png',
  'py.png', 'ny.png',
  'pz.png', 'nz.png'
]);

scene.background = textureCube;


scene.add(world)

const graphic = new GraphicsManager(scene,camera,framerate)
const buttonInteraction= new ButtonInteraction()
//const controls=new OrbitControls(camera,graphic.domElement)//to look around the map easily
const customControls=new CustomControls(camera,scene)
graphic.OnUpdate(dt=>{
    //console.log("delta time: "+graphic.GetDeltaTime())
    //animManager.UpdateAnimation(dt)
    //console.log(dt)
    customControls.CameraMovement(0.7,3,dt)
})//the attribute is a function(dt) passed as callback, everything inside it will be executed each frame //dt has no purpose //arrow functions allows to create an anonym function in a variable

function GoBack(){
  console.log("button works")
}