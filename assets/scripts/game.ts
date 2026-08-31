import {gamedata} from "./common/gamedata";
import {gameevent} from "./common/gameevent";

import { GameState } from "./common/gameconst";
import { _decorator, Component, Node, Vec3 ,director,Label} from 'cc';
const { ccclass, property } = _decorator;

// 在类外部或类内部提前实例化一个复用变量，避免在 update 里反复 new / 产生垃圾
const tempPos = new Vec3();
const a=new Vec3();
const b=new Vec3();

interface NodeInitPos { node: Node; pos: Vec3; }

@ccclass('game')
export class game extends Component {
    @property(Node)
    grass: Node = null;

    @property(Node)
    buiding: Node = null;

    @property(Node)
    cloud: Node = null;

    @property(Node)
    gamestart: Node = null;

    @property(Node)
    teach: Node = null;

    @property(Label)
    score: Label = null;

    @property(Node)
    over: Node = null;

    private acceleration: number = 0;
    private speed: number = 280;

    private grassInitPos: NodeInitPos[] = [];
    private buidingInitPos: NodeInitPos[] = [];
    private cloudInitPos: NodeInitPos[] = [];

    private bgpos(deltaTime: number) {
        this.grasspos(deltaTime);
        this.buidingpos(deltaTime);
        this.cloudpos(deltaTime);
    }

    private grasspos(deltaTime: number) {
          if (!this.grass) {
            return;
        }

        const grasslist = this.grass.children;
        

        for (let i = 0; i < grasslist.length; i++) {
            const grassnode = grasslist[i];
            if (!grassnode) {
                continue;
            }

            // 优化 1：通过传入 tempPos 变量来获取位置，不会创建新的对象
            grassnode.getPosition(tempPos);
            // 优化 2：直接操作 tempPos 的属性
            tempPos.x -= this.speed * deltaTime;

            if (tempPos.x <= -60) {
                tempPos.x += 2100;
            }

            // 设置新位置
            grassnode.setPosition(tempPos);
        }
    }
    private buidingpos(deltaTime: number) {
        if (!this.buiding) {
            return;
        }

        const buidinglist = this.buiding.children;
        

        for (let i = 0; i < buidinglist.length; i++) {
            const buidingnode = buidinglist[i];
            if (!buidingnode) {
                continue;
            }

            // 优化 1：通过传入 tempPos 变量来获取位置，不会创建新的对象
            buidingnode.getPosition(a);
           
            // 优化 2：直接操作 tempPos 的属性
            a.x -= this.speed * deltaTime*0.4;

            if (a.x <= -60) {
                a.x += 2100;
            }

            // 设置新位置
            buidingnode.setPosition(a);
        }
    }
    private cloudpos(deltaTime: number) {
        if (!this.cloud) {
            return;
        }

        const cloudlist = this.cloud.children;
        

        for (let i = 0; i < cloudlist.length; i++) {
            const cloudnode = cloudlist[i];
            if (!cloudnode) {
                continue;
            }

            // 优化 1：通过传入 tempPos 变量来获取位置，不会创建新的对象
            cloudnode.getPosition(b);
            
            // 优化 2：直接操作 tempPos 的属性
            b.x -= this.speed * deltaTime*0.05;

            if (b.x <= -60) {
                b.x += 363;
            }

            // 设置新位置
            cloudnode.setPosition(b);
        }
    }
    start() {
         this.saveInitPos();
         this.initialize();
         this.eventlistener();
    }

    private saveInitPos() {
        this.grassInitPos = [];
        this.buidingInitPos = [];
        this.cloudInitPos = [];

        if (this.grass) {
            for (let i = 0; i < this.grass.children.length; i++) {
                const node = this.grass.children[i];
                if (node) {
                    this.grassInitPos.push({ node, pos: node.getPosition().clone() });
                }
            }
        }
        if (this.buiding) {
            for (let i = 0; i < this.buiding.children.length; i++) {
                const node = this.buiding.children[i];
                if (node) {
                    this.buidingInitPos.push({ node, pos: node.getPosition().clone() });
                }
            }
        }
        if (this.cloud) {
            for (let i = 0; i < this.cloud.children.length; i++) {
                const node = this.cloud.children[i];
                if (node) {
                    this.cloudInitPos.push({ node, pos: node.getPosition().clone() });
                }
            }
        }
    }

    private resetBgPos() {
        for (const item of this.grassInitPos) {
            item.node.setPosition(item.pos);
        }
        for (const item of this.buidingInitPos) {
            item.node.setPosition(item.pos);
        }
        for (const item of this.cloudInitPos) {
            item.node.setPosition(item.pos);
        }
    }

    private touchstart() {
        console.log("touchstart");

    }

    private touchend() {  
        console.log("touchend");
      }

    private touchcancel() {  
        console.log("touchcancel");
      }    

    private eventlistener() {
        this.node.on(Node.EventType.TOUCH_START, this.touchstart, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchend, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchcancel, this);
        director.on(gameevent.GameStart, this._onGameStart,this);
        director.on(gameevent.GameOver, this._onGameOver,this);
        director.on(gameevent.addscore, this._addscore,this);
        director.on(gameevent.jixuyouxi, this._jixuyouxi,this);
    }
    private _jixuyouxi() {}

    private _addscore() {
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
        console.log("加分");
        gamedata.instance.score+=5;
        this.score.string = gamedata.instance.score.toString();
        if(gamedata.instance.score>gamedata.instance.bestscore){
            gamedata.instance.bestscore=gamedata.instance.score;
        }
    }
    private _onGameStart() {
        console.log("游戏开始");
        console.log("最佳分数: " + gamedata.instance.bestscore);
        gamedata.instance.score = 0;
        this.score.string = "0";
        gamedata.instance.gamestate = GameState.Playing;
        gamedata.instance.allowagain = true;
        this.resetBgPos();
    }
    private _onGameOver() {
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
        console.log("游戏结束, 当前分数: " + gamedata.instance.score + ", 最佳分数: " + gamedata.instance.bestscore);
        if (gamedata.instance.score >= gamedata.instance.bestscore) {
            gamedata.instance.bestscore = gamedata.instance.score;
            gamedata.instance.saveBestScore();
            console.log("保存最佳分数: " + gamedata.instance.bestscore);
            
        }
        gamedata.instance.gamestate=GameState.GameOver
        this.over.active = true;
    }
    private initialize() {
        this.gamestart.active = true;
         this.teach.active = false;
         this.over.active = false;
         gamedata.instance.gamestate = GameState.Start;
         gamedata.instance.loadBestScore();
         gamedata.instance.score = 0;
         this.score.string = "0";
        }
    protected onDestroy(): void {
        director.off(gameevent.GameStart, this._onGameStart,this);
        this.node.off(Node.EventType.TOUCH_END, this.touchend, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchcancel, this);
        this.node.off(Node.EventType.TOUCH_START, this.touchstart, this);
        director.off(gameevent.GameOver, this._onGameOver,this);
        director.off(gameevent.addscore, this._addscore,this);
        director.off(gameevent.jixuyouxi, this._jixuyouxi,this);
    }

    update(deltaTime: number) {
         this.speed+=this.acceleration*deltaTime;
      this.bgpos(deltaTime);
    }
}