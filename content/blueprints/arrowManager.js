import { Graph } from "../data/graph"
import {Clock,MathUtils, DoubleSide, AdditiveBlending, TextureLoader, NormalBlending} from "three";
import Utils from "../data/utils";

export class ArrowManager{
    static MakeArrow(arrow,camera){//adds the needed attributes and functions to the arrow
        arrow.material=arrow.material.clone()//create a copy so ifwe change the material color it only changes for this arrow and not for ALL arrows that have the material
        this.AdjustOpacity(arrow.material)

        arrow.fromRoom=arrow.name.split("To")[0]
        arrow.toRoom=arrow.name.split("To")[1]
        arrow.interact=function(){

            const arrowDirection=Graph.GetRoom(arrow.toRoom).position.clone().sub(Graph.GetRoom(arrow.fromRoom).position)
            const fromRoomPosition=camera.position.clone()
            const toRoomPosition=Graph.GetRoom(arrow.toRoom).position.clone()
            toRoomPosition.y+=0.5//raise camera to avoid collision stuck in mesh
            camera.rotation.x=MathUtils.degToRad(-10)//look below since we'll raise camera

            //animate the movement
            if(camera.isMoving){return}else{camera.isMoving=true}//animation already running
            var animDuration=0.5
            var timer=new Clock()
            var t=0
            var moveAnim=setInterval(function(){//https://javascript.info/js-animation

                if(timer.getElapsedTime()>animDuration){
                    clearInterval(moveAnim)
                    camera.isMoving=false

                    //show only rooms and arrows meshes relevant to the actual position //updated once the animation is finished 
                    Graph.GetRoom(arrow.fromRoom).visible=true
                    Graph.GetRoom(arrow.toRoom).visible=false

                    for(const tempArrow of Graph.GetArrows()){//"arrow" is already used as function argument so we use "tempArrow"
                        //tempArrow.visible=false//hide all arrows
                        tempArrow.layers.set(1); //hide and disable collision
                    }
                    for(const adjacentArrow of Graph.GetAdjacentArrows(arrow.toRoom)){
                        //adjacentArrow.visible=true//show only necessary arrows
                        adjacentArrow.layers.set(0); //show and enable collision
                    }
                    return
                }
                t=timer.getElapsedTime()/animDuration
                camera.position.x=Utils.SmoothStep(fromRoomPosition.x,toRoomPosition.x,t)
                camera.position.y=Utils.SmoothStep(fromRoomPosition.y,toRoomPosition.y,t)
                camera.position.z=Utils.SmoothStep(fromRoomPosition.z,toRoomPosition.z,t)

            },1/camera.framerate)
        }
    }

    static AdjustOpacity(material){
        const loader = new TextureLoader();
        const alphaTexture = loader.load("opacityFadeWhite.png")
        alphaTexture.flipY = false; //because threeJS UVs are flipped verticaly compared to png
    
        material.color.set(0xffffff) 
        //both following lines are needed for correct opacity fade rendering   
        material.map = alphaTexture
        material.alphaMap=alphaTexture
    }
}