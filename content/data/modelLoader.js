import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
import { Object3D } from "three";
import Utils from "../data/utils";

const loaderGlb=new GLTFLoader()

export async function LoadAssets(path){
    const glb=await loaderGlb.loadAsync(path)//gltf and glb are two graphic library(gl) transmission formats
    const visuals=[]
    const colliders=[]

    for(const mesh of glb.scene.children){
        const name=mesh.name
        if(name.includes('UCX')){
            colliders.push(mesh)
        }
        else{
            visuals.push(mesh)
        }
    }
    return {visuals}
}

export async function LoadAnimatedAssets(path){
    const glb=await loaderGlb.loadAsync(path)
    const mesh=glb.scene.children[0]//the animated asset should be the only model in the file
    if(typeof mesh=='undefined'){
        console.log("an animated mesh 3d file might be empty")
    }
    Utils.Browse(mesh, m=>m.castshadow=true)
    mesh.clips=glb.animations//even if they are called "animations" in thr glb it is still only clips
    return mesh
}