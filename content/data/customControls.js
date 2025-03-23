import { Vector2 } from 'three'
import { Raycaster } from 'three/src/core/Raycaster'

export class CustomControls{

    constructor(camera,scene){
        document.addEventListener("click",this.OnClick.bind(this))//https://stackoverflow.com/questions/68942683/javascript-event-listener-in-class
        document.addEventListener("mousemove",this.MouseMove.bind(this));
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();//in normalized device coordinates
        this.camera=camera
        //camera=camera
        this.scene=scene
    }
    
    OnClick(event){
        //console.log("click")
        var hitResult=this.GetObjectUnderCursor(event)
        //console.log(hitResult?.interact)
        if(hitResult!=null && hitResult.visible && typeof hitResult?.interact=='function'){//if object is not null and is visible and implements interact() //Object3D is guaranted to have "visible" attribute
            hitResult.interact()
        }
    }

    MouseMove(event){
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //console.log(this.pointer.x+"/"+this.pointer.y)
    }

    GetObjectUnderCursor(event){//https://threejs.org/docs/#api/en/core/Raycaster
        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );
        if(intersects.length>0){
            var root=intersects[0].object//here we loose some raycasting data because we only take the object attribute
            while(root.parent.type=="Mesh" || root.parent.type=="Group"){//determine which root will be used for model transform//https://stackoverflow.com/questions/26202064/how-to-select-a-root-object3d-using-raycaster
                root=root.parent
            }
            console.log("Raycast:",root)
            return root
        }else{
            return null
        }
    }

    CameraMovement(borderSize,speedMultiplier,deltaTime){//borderSize between 0-1
        const borderStart=1-borderSize
        if(Math.abs(this.pointer.x)>borderStart){//mouse on the borders of the screen
            const speedNormalized=Math.sign(this.pointer.x)*(Math.abs(this.pointer.x)-borderStart)/borderSize
            this.camera.rotation.y-=speedNormalized*speedMultiplier*deltaTime//rotation in trigo direction so minus instead of plus
        }
    }
}
/*
NOTES ABOUT BLENDER EXPORT
-in export settings apply modifiers and tick +yUp
-three.js consider each material zone as a different sub-object, which means:
    -importing a model made out 1 material will create an object with the same name as in blender
    -importing a model made out of >=2 materials will create an sub-object for each material with a "random" name, all those are wrapped in another object with the same name as in blender
    -using the Raycast on multi materials models will return sub-objects
        -to move a multimaterial object, we need its root, else only model parts with a single material will move at once
-the gltf keeps the blender hierarchy
-in the hierarchy, if an object have only one child it is a "Mesh", if it has children(>=2) it is a "Group", both extends the "Object3D" class
*/