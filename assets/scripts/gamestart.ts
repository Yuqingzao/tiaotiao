import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gamestart')
export class gamestart extends Component {


@property(Node)
teach: Node = null;

    start() {

    }


    public calloutteacher() {
        this.node.active = false;
        if (this.teach) {
            this.teach.active = true;
        }
    }
    update(deltaTime: number) {
        
    }
}


