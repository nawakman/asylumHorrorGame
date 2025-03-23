import { Clock,MathUtils} from "three";
import Utils from "../data/utils";

export class DoorManager{

    static MakeDoor(door,framerate){//adds the needed attributes and functions to the door
        console.log(framerate)
        door.isOpen=false//creates and initialize variable
        door.isMoving=false
        door.interact=function(){//https://stackoverflow.com/questions/13521833/javascript-add-method-to-object

            if(door.isMoving){return}else{door.isMoving=true}//animation already running 
            var animDuration=0.5
            var timer=new Clock()
            var t=0
            var doorAnim=setInterval(function(){//https://javascript.info/js-animation

                if(timer.getElapsedTime()>animDuration){
                    clearInterval(doorAnim)
                    door.isOpen=!door.isOpen
                    door.isMoving=false
                    return
                }
                t=timer.getElapsedTime()/animDuration
                door.rotation.y=Utils.SmoothStep(door.isOpen?MathUtils.degToRad(90):0,door.isOpen?0:MathUtils.degToRad(90),t)

            },1/framerate)
        }
    }
}