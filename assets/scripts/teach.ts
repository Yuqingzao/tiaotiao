import { _decorator, Component, Node ,director} from 'cc';
import {gamedata} from "./common/gamedata";
import {gameevent} from "./common/gameevent";
import { GameState } from "./common/gameconst";
const { ccclass, property } = _decorator;

@ccclass('teach')
export class teach extends Component {
    @property(Node)
    gameoverview:Node=null;
    start() {

    }
    public know() {
        if(gamedata.instance.gamestate!=GameState.GameOver){
            this.node.active = false;
        gamedata.instance.gamestate = GameState.Playing;
        director.emit(gameevent.GameStart);
    }else{
        this.node.active=false
        this.gameoverview.active=true
    }
        }
        
    update(deltaTime: number) {
        
    }
}


