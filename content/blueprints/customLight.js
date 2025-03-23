import { AmbientLight,PointLight,Object3D, Vector2 } from "three";

export class CustomLight extends Object3D{
    constructor(){
        super()
        const ambient=new AmbientLight(0xffffff,1)
        const point=new PointLight(0xffffff,3)
        point.position.set(2,2,2)
        point.castShadow=true
        point.shadow.bias=-0.001
        point.shadow.mapSize=new Vector2(256,256)

        this.add(ambient)//add components to the object
        this.add(point)
    }
}