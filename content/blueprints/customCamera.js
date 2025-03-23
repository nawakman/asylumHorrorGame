import { PerspectiveCamera } from "three";

export class CustomCamera extends PerspectiveCamera{//https://stackoverflow.com/questions/42184655/reason-behind-the-default-keyword-for-es6
    constructor(framerate){
        super(90,innerWidth/innerHeight)
        this.framerate=framerate//copied from the framerate of app.js
        this.isMoving=false
        this.rotation.order='YXZ'//https://stackoverflow.com/questions/16675676/threejs-rotation-by-x-and-z-works-individually-but-fails-together //https://github.com/mrdoob/three.js/issues/1163
        this.position.set(7,7,7)//y is vertical
        this.lookAt(0,0,0)
        
    }
}