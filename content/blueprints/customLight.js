import { AmbientLight,DirectionalLight,Object3D } from "three";

export class CustomLight extends Object3D{
    constructor(){
        super()
        const ambient=new AmbientLight(0xffffff,2)
        /*const point=new PointLight(0xffffff,3)
        point.position.set(2,2,2)
        point.castShadow=true
        point.shadow.bias=-0.001
        point.shadow.mapSize=new Vector2(256,256)*/

        //https://discoverthreejs.com/book/first-steps/ambient-lighting/
        const directional = new DirectionalLight('white', 2);
        directional.position.set(10, 10, 10);
        const directional2 = new DirectionalLight('white', 2);
        directional.position.set(-10, -10, 10);

        this.add(ambient)//add components to the object
        this.add(directional)
        this.add(directional2)
        //this.add(point)
    }
}