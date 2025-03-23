export default class Utils{//https://www.trysmudford.com/blog/linear-interpolation-functions/
    static Lerp=(x,y,t)=>x*(1-t)+y*t
    //static Slerp=(x,y,t)=>x*Math.cos(t*Math.PI/2)+y*Math.sin(t*Math.PI/2)//Slerp stinks, it overshoots
    static SmoothStep=(x,y,t)=>this.Lerp(x,y,3*Math.pow(t,2)-2*Math.pow(t,3))//https://en.wikipedia.org/wiki/Smoothstep
    static SmootherStep=(x,y,t)=>this.Lerp(x,y,6*Math.pow(t,5)-15*Math.pow(t,4)+10*Math.pow(t,3))
    static Clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
    static Invlerp = (x, y, t) => clamp((t - x) / (y - x));
    static Range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

    static Browse(object, callback) {//apply function to all children using DFS
        if(object.isMesh){
            callback(object)//the one in args
        }
        const children=object.children
        for(let i=0;i<children.length;i++){
            this.Browse(children[i],callback)
        }
    }
}