import { WebGLRenderer, Clock } from "three";

export class GraphicsManager extends WebGLRenderer {
    deltaClock = new Clock()
    cbUpdate = null//cb for callback, storing the update function in a variable will allow to call it from somewhere else in the code //https://stackoverflow.com/questions/53946822/javascript-how-to-call-a-function-stored-in-a-variable

    constructor(scene, camera, fps) {
        super({ canvas: document.querySelector('#myCanvas'), antialias: true })//get a reference and associate the canvas of the html to the renderer
        this.scene = scene
        this.camera = camera
        this.desiredDeltaTime = 1 / fps
        this.deltaTime = 0

        this.setSize(window.innerWidth, window.innerHeight);
        this.shadowMap.enabled = true//tells three to render shadows
        this.cbLoop = this.Loop.bind(this)//calls the "loop" function as "this", so when cbLoop is called from anywhere, it is in fact called from "this"
        //https://www.w3schools.com/js/tryit.asp?filename=tryjs_function_bind_borrow
        //https://stackoverflow.com/questions/2236747/what-is-the-use-of-the-javascript-bind-method

        this.Loop()//starts the loop
    }

    Loop() {//only handles graphic stuff. For game related stuff, do it in app.js
        requestAnimationFrame(this.cbLoop)//browser can refresh many,many times per second but we want to limit three.js to a fps limit//just before the browser refreshes the screen, it will call the function passed as argument//calls loop recursively
        if (this.deltaClock.getElapsedTime() < this.desiredDeltaTime) {//this if/else handles framerate //https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
            return
        } else {
            this.deltaTime = this.deltaClock.getElapsedTime()//this is our deltaTime for the whole project
            if (this.cbUpdate) { this.cbUpdate(this.deltaTime) }//if there is something to do each frame, do it (handle case if the callback of OnUpdate is empty)
            this.deltaClock.start()//reset delta time for next iteration
            this.render(this.scene, this.camera)//render scene with all scene modifications
        }
    }
    OnUpdate(callback) {//sets and updates the callback function to be executed each frame
        this.cbUpdate = callback
    }
    GetDeltaTime() {
        return this.deltaTime
    }
}