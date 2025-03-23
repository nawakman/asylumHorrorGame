export class Graph{//we only need a single graph to represent a level, and we want to access it from anywhere, so the class will be static

    static graph=new Map()//map composed of key=[roomName:String], value=[map composed of key=[toRoom:String], value={arrow:arrowMesh}]
    static meshesWithTo=[]//meshes whose name contain "To", they define graph edges e.g. "room1ToRoom2" will create an edge between room 1&2
    static meshesWithRoom=new Map()//meshes whose name contain "room", they define graph vertices and will be accessed via their name
    static floydWarshallDistanceArray=new Map()//will store the distance matrix
    static floydWarshallPaths=new Map()//will all shortest paths between two vertex

    constructor(){
        throw Error('A static class cannot be instantiated.')//https://fab1o.medium.com/javascript-static-class-3e1acdaec81
    }

    /*static MakeGraph(mapVisuals){//the maps contains all vertices and edges, and other stuff that will be considered as isolated vertex and thus removed //old
        for(const mesh of mapVisuals){//this loop separe edges(meshesWithTo) and vertices(meshesWithRoom) in different arrays
            if(mesh.name.includes("To")){
                this.meshesWithTo.push(mesh)
            }else if(mesh.name.includes("room")){
                const meshNameWithoutRoom=mesh.name.split("room")[1]//removes "room" from the String
                this.meshesWithRoom.set(meshNameWithoutRoom,mesh)
                this.graph.push({roomName:meshNameWithoutRoom,adjacentRooms:[]})//push an object containing graph data //https://stackoverflow.com/questions/20392782/a-list-of-tuples-in-javascript
            }
        }
        for(const orientedEdge of this.meshesWithTo){//this loop fills the adjacent rooms of each rooms using "meshWithTo" data
            const roomNames=orientedEdge.name.split("To")//the edge is oriented, it goes from the room before "To" to the room after "To"
            const fromRoom=this.graph.find((temp)=>temp.roomName==roomNames[0])//finds the room we begin the edge with
            fromRoom.adjacentRooms.push({toRoom:roomNames[1],arrow:orientedEdge})//tell it that it can now go to "roomNames[1]"
        }
        const lengthBeforeModification=this.graph.length//in the loop we cannot rely on "length" because it will change
        for(var i=0;i<lengthBeforeModification;i++){//this loop(and the splice after) removes isolated vertices
            if(this.graph[i].adjacentRooms.length!=0){
                this.graph.push(this.graph[i])//copy all the values we want to keep at the end of array //https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
            }
        }
        this.graph.splice(0,lengthBeforeModification)
        console.log(this.graph)
        console.log(this.meshesWithRoom)
    }*/

    static MakeGraph(mapVisuals){//the maps contains all vertices and edges, and other stuff that will be considered as isolated vertex and thus removed
        for(const mesh of mapVisuals){//this loop separe edges(meshesWithTo) and vertices(meshesWithRoom) in different arrays
            if(mesh.name.includes("To")){
                this.meshesWithTo.push(mesh)
            }else if(mesh.name.includes("room")){
                const meshNameWithoutRoom=mesh.name.split("room")[1]//removes "room" from the String
                this.meshesWithRoom.set(meshNameWithoutRoom,mesh)
                this.graph.set(meshNameWithoutRoom,new Map())
            }
        }
        for(const orientedEdge of this.meshesWithTo){//this loop fills the adjacent rooms of each rooms using "meshWithTo" data
            const roomNames=orientedEdge.name.split("To")//the edge is oriented, it goes from the room before "To" to the room after "To"
            this.graph.get(roomNames[0]).set(roomNames[1],{arrow:orientedEdge})//finds the room we begin the edge with, tell it that it can now go to "roomNames[1]" //tuple because we might add properties later //https://stackoverflow.com/questions/64278135/how-to-update-map-object-property-values //https://stackoverflow.com/questions/20392782/a-list-of-tuples-in-javascript
        }
        this.FloydWarshall()//create all shortest paths between two vertex
        console.log(this.graph)
        //console.log(this.meshesWithRoom)
    }


    static GetArrows(){
        return this.meshesWithTo
    }
    static GetRoom(roomName){
        return this.meshesWithRoom.get(roomName)
    }

    static GetAdjacentArrows(roomName){
        const adjacentArrows=[]
        for(const adjacentRoom of this.graph.get(roomName).keys()){
            adjacentArrows.push(this.graph.get(roomName).get(adjacentRoom).arrow)
        }
        return adjacentArrows
    }

    static GetAdjacentRooms(roomName){
        const adjacentRooms=[]
        for(const adjacentRoom of this.graph.get(roomName).keys()){
            adjacentRooms.push(this.GetRoom(adjacentRoom))
        }
        return adjacentRooms
    }

    static FloydWarshall(){//compute all shortest paths of the map
        const vertexNames=Array.from(this.graph.keys())//get all rooms names that will be used as our matrix indexes //keys() return a consumable iterator so we convert it to array//I know it is inefficient since int array would be better, it is for easier understanding
        for(const i of vertexNames){//create arrays
            this.floydWarshallDistanceArray.set(i,new Map())
            this.floydWarshallPaths.set(i,new Map())
            for (const j of vertexNames){
                this.floydWarshallDistanceArray.get(i).set(j,-1)//-1 means no path yet
                this.floydWarshallPaths.get(i).set(j,"")//no successor yet
            }
        }

        for(const i of vertexNames){//INIT loop
            for (const j of this.graph.get(i).keys()){//we include the "belongs to graph" check in the condition
                this.floydWarshallDistanceArray.get(i).set(j,1)//all paths have a cost of 1 for our application
                this.floydWarshallPaths.get(i).set(j,j)//paths between two adjacent vertex
            }
        }
        for(const i of vertexNames){//ALGO loop
            for (const a of vertexNames){
                if(this.floydWarshallDistanceArray.get(a).get(i)!=-1){//if we can go from a to i
                    for(const b of vertexNames){
                        if(this.floydWarshallDistanceArray.get(i).get(b)!=-1){//if we can go from i to b (meaning there is a path a->i->b)
                            if(this.floydWarshallDistanceArray.get(a).get(b)==-1 || this.floydWarshallDistanceArray.get(a).get(b)>this.floydWarshallDistanceArray.get(a).get(i)+this.floydWarshallDistanceArray.get(i).get(b)){//if a->b does not exist or a->i->b better than a->b
                                this.floydWarshallDistanceArray.get(a).set(b,this.floydWarshallDistanceArray.get(a).get(i)+this.floydWarshallDistanceArray.get(i).get(b))
                                this.floydWarshallPaths.get(a).set(b,this.floydWarshallPaths.get(a).get(i))//the next vertice in shortest path from a to b is the next vertice in the shortest path from a to i
                                //console.log(a+"/"+x+"/"+this.floydWarshallPaths.get(a).get(x))
                            }
                        }
                    }
                }
            }
        }
    }

    static GetPath(from,to){
        const vertices=[]
        if(this.floydWarshallPaths.get(from).get(to).localeCompare("")==0){//no paths
            return vertices
        }
        vertices.push(from)
        while(from.localeCompare(to)!=0){//while not at the end of the path
            from=this.floydWarshallPaths.get(from).get(to)
            vertices.push(from)
        }
        return vertices
    }

    static HighLightPath(from,to){
        for(const arrow of this.GetArrows()){//turn all arrows red before highlighting new path
            arrow.material.color.set(0xff0000)
        }
        const path=this.GetPath(from,to)
        for(let i=0;i<path.length-1;i++){
            this.graph.get(path[i]).get(path[i+1]).arrow.material.color.set(0x00ff00)//turn arrows green 
        }
    }
}