import { Object3D } from "three";
import {DoorManager} from "../blueprints/doorManager";
import { ArrowManager } from "../blueprints/arrowManager"

export class World extends Object3D{
    constructor(){
        super()
        //this.initPhysics()
        //this.AddMeshes(visuals)
    }

    AddMeshes(meshes){//put all meshes in a World Object
        for(const mesh of meshes){
            mesh.receiveShadow=true
            mesh.castShadow=true
            this.add(mesh)
        }
    }
    AddInteractions(meshes,camera){
        for(const mesh of meshes){
            if(mesh.name.includes('door')){
                DoorManager.MakeDoor(mesh,camera.framerate)
            }
            if(mesh.name.includes('To')){
                ArrowManager.MakeArrow(mesh,camera)
            }
            /*if(mesh.name.includes('room')){
                RoomManager.MakeRoom(mesh)
            }*/
        }
    }
}