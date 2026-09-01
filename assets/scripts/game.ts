import {gamedata} from "./common/gamedata";
import {gameevent} from "./common/gameevent";

import { GameState } from "./common/gameconst";
import { _decorator, Component, Node, Vec3 ,director,Label,animation} from 'cc';
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

    @property(Node)
    player:Node=null;
    private donghuakongzhi:animation.AnimationController=null
    private ypos:number=-150;
    private accelerationset: number = 0;
    private speedset: number = 280;

    private yaccelerationset: number = -400;
    private yspeedset: number = 0;
    
    private acceleration: number = this.accelerationset;
    private speed: number = this.speedset;

    private yacceleration: number = this.yaccelerationset;
    private yspeed: number = this.yspeedset;

    private grassInitPos: NodeInitPos[] = [];
    private buidingInitPos: NodeInitPos[] = [];
    private cloudInitPos: NodeInitPos[] = [];


    private is_dimian:boolean = null;
private has_gan:boolean = null;
private is_chenggan:boolean = null;
private is_up:boolean = null;
private is_chengsan:boolean = null;
private is_feng:boolean = null;
private is_over:boolean = null;
private cannagan:boolean=null;
private mubiaoganzi:Node=null;
private tiaoyuegaodu:number=500;


    private bgpos(deltaTime: number) {
        this.grasspos(deltaTime);
        this.buidingpos(deltaTime);
        this.cloudpos(deltaTime);
        this.player_y(deltaTime);

    }
    private player_y(deltaTime: number){

        this.yspeed+=this.yacceleration*deltaTime;
        let ypos = this.player.getPosition().y + this.yspeed*deltaTime;
this.player.setPosition(this.player.getPosition().x,Math.max(ypos,this.ypos));

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
         this.donghuakongzhi=this.player.getComponent(animation.AnimationController)
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
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
        console.log("touchstart");
        if(this.is_dimian){
            if(this.cannagan&&!this.has_gan){
                this.has_gan=true;
                this.mubiaoganzi.getChildByName("ganzi").active=false;
                this.donghuakongzhi.setValue("has_gan", this.has_gan);
            }else if(this.has_gan){
                this.is_chenggan=true;
               
                this.donghuakongzhi.setValue("is_chenggan", this.is_chenggan);
            }else{
                this.yacceleration = 0;
                this.yspeed = this.tiaoyuegaodu;
            }
        }
       

        

    }

    private touchend() {  
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
        console.log("touchend");
      }

    private touchcancel() {  
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
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
        director.on(gameevent.cannagan, this._cannagan,this);
        director.on(gameevent.cannotnagan, this._cannotnagan,this);
    }
    private _jixuyouxi() {}


    private _cannagan(data:{targetnode:Node}){
        console.log("可以拿杆子");
        this.cannagan=true;
        this.mubiaoganzi=data.targetnode;
        console.log("当前碰撞目标杆子：",this.mubiaoganzi.name);

    }
    private _cannotnagan(data:{targetnode:Node}){
        console.log("不能拿杆子");
        this.cannagan=false;
    }
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
        director.off(gameevent.cannagan, this._cannagan,this);
        director.off(gameevent.cannotnagan, this._cannotnagan,this);
    }
    private state_panduan(){
        if(this.player.getPosition().y>this.ypos){
            this.is_dimian=false;
        }else{
            this.is_dimian=true;
             this.acceleration = this.accelerationset;
        this.speed = this.speedset;

        this.yacceleration = this.yaccelerationset;
        this.yspeed = this.yspeedset;

        }
        if(this.yspeed>0){
            this.is_up=true;
        }else{
            this.is_up=false;
        }
        this.donghuakongzhi.setValue("is_dimian", this.is_dimian);
        this.donghuakongzhi.setValue("is_up", this.is_up);


    }
    update(deltaTime: number) {
         this.speed+=this.acceleration*deltaTime;
      this.bgpos(deltaTime);
        this.state_panduan();
    }
}