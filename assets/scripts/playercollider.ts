import { _decorator, Collider2D, Component, director,Node ,Contact2DType,IPhysics2DContact} from 'cc';
import {gameevent} from "./common/gameevent";
const { ccclass, property } = _decorator;

@ccclass('playercollider')
export class playercollider extends Component {
    start() {
        const collider=this.getComponent(Collider2D)
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this)
            collider.on(Contact2DType.END_CONTACT,this.onEndContact,this)
        }
    }
    protected onDestroy(): void {
        const collider=this.getComponent(Collider2D)
        if(collider){
            collider.off(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this)
            collider.off(Contact2DType.END_CONTACT,this.onEndContact,this)
        }
    }
    private onEndContact(me:Collider2D,other:Collider2D,data:IPhysics2DContact|null) {
        console.log("Player end contact with something");
         if(me.tag==1){
            if(other.tag==100){
                director.emit(gameevent.cannotnagan)
    }
}}
    private onBeginContact(me:Collider2D,other:Collider2D,data:IPhysics2DContact|null){
        console.log("Player contact with something");
        if(me.tag==1){
            if(other.tag==10){
                director.emit(gameevent.GameOver);
            }else if(other.tag==5){
                director.emit(gameevent.addscore)
            }else if(other.tag==100){
                director.emit(gameevent.cannagan,{targetnode:other.node})
            }
        }
    }
    update(deltaTime: number) {
        
    }
}


