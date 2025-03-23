import { LoopOnce, AnimationMixer } from "three";

export class AnimationManager {
    animations = new Map()//https://threejs.org/docs/#api/en/animation/AnimationAction
    mixer = null
    clips = null//https://threejs.org/docs/#api/en/animation/AnimationClip
    current = null

    constructor(mesh) {
        this.mixer = new AnimationMixer(mesh)
        this.clips = mesh.clips
        console.log(this.clips)
    }

    LoadAnimation(animName, playOnce) {
        const clip = this.clips.find((elem) => elem.name == animName)//https://discourse.threejs.org/t/animationmixer-clipaction-inside-gltf-scene-by-name/15361
        if (typeof clip == 'undefined') {
            console.log("animation \'", animName, "\' not found !")
        }
        const animation = this.mixer.clipAction(clip)//convert clip to AnimationAction //https://threejs.org/docs/#api/en/animation/AnimationAction
        //animation.setDuration(0)
        if (playOnce) {
            animation.setLoop(LoopOnce)
        }
        this.animations.set(animName, animation)//add entry to the map
    }

    PlayAnimation(animName) {
        if (!this.animations.has(animName)) {
            console.log("Cannot play \'", animName, "\' , animation not found")
        }

        const animation = this.animations.get(animName)
        if (this.current && this.current != animation) {//stop current animation if one is playing
            this.current.stop()
            console.log("animation stopped to avoid overwriting")
        }
        this.current = animation
        if (this.current.isRunning()) {//avoid playing the same animation many time at once
            console.log("animation already running")
            return
        }
        this.current.reset()
        this.current.play()
    }

    UpdateAnimation(dt) {
        this.mixer.update(dt)
    }
}
/*
NOTE: In Blender to export many animation put them in the NLA tab UNDER THE MESH, not under the armature
If export selected only is ticked, make sure to select both the armature and the mesh before exporting
*/