import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
    @property(Node)
    grass:Node=null
    start() {

    }

    update(deltaTime: number) {
        if(!this.grass){
            return
        }
        let grasslist=this.grass.children
        for(let i=0;i<grasslist.length;i++){
            let grassnode=grasslist[i]
            if(!grassnode ){
                continue;
            }
            let posy=grassnode.getPosition().y
            let posx=grassnode.getPosition().x
            let speed = 200; 
            posx -= speed * deltaTime;
           
            if(posx<=0){
                posx+=1440
            }
            grassnode.setPosition(posx,posy)
         
}
        }
    }



