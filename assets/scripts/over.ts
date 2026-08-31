import { _decorator, Component, Node,Label ,director,Sprite,color} from 'cc';
import {gamedata} from "./common/gamedata";
import {gameevent} from "./common/gameevent";

import { GameState } from "./common/gameconst";
const { ccclass, property } = _decorator;

@ccclass('over')
export class over extends Component {
    @property(Label)
    score: Label = null;

    @property(Label)
    bestscore: Label = null;

    @property(Node)
    new: Node = null;
    
    @property(Node)
    teach: Node = null;

    @property(Node)
    paqizaizhan: Node = null;
    start() {
    }
    onEnable() {
        this.refresh();
    }
    public refresh() {
        const dqfs=gamedata.instance.score;
        if(this.score){
            this.score.string=dqfs.toString();
        }
        const zf=gamedata.instance.bestscore;
        if(this.bestscore){
            this.bestscore.string=zf.toString();
        }
        if(this.new){
            this.new.active=(dqfs>0 && dqfs>=zf);
        }
    }

    public again() {
        this.node.active = false;
        gamedata.instance.score = 0;
        gamedata.instance.gamestate = GameState.Start;
        director.emit(gameevent.GameStart);
    }


    public hereagain() {
        if(gamedata.instance.allowagain){
            this.node.active = false;
            gamedata.instance.allowagain=false;
            gamedata.instance.gamestate = GameState.Playing;
            director.emit(gameevent.jixuyouxi);
        }
    }

    public jiaocheng(){
        this.teach.active=true
        this.node.active=false
    }
    update(deltaTime: number) {
        if(gamedata.instance.allowagain){
        this.paqizaizhan.getComponent(Sprite).color=color(255,255,255,255);
    }else{
        this.paqizaizhan.getComponent(Sprite).color=color(73,52,52,255);
    }
}
}

