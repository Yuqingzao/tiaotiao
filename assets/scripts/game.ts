import {gamedata} from "./common/gamedata";
import {gameevent} from "./common/gameevent";

import { GameState } from "./common/gameconst";
import { _decorator, Component, Node, Vec3 ,director,Label,animation,BoxCollider2D,UITransform, AudioSource, AudioClip} from 'cc';
const { ccclass, property } = _decorator;

// 在类外部或类内部提前实例化一个复用变量，避免在 update 里反复 new / 产生垃圾
const tempPos = new Vec3();
const a=new Vec3();
const b=new Vec3();

interface NodeInitPos { node: Node; pos: Vec3; }
interface ZhangaiInit { gan: Node; poor: Node; ganzi: Node | null; ganPos: Vec3; poorPos: Vec3; poorScale: Vec3; ganActive: boolean; ganziActive: boolean; }

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

    @property(AudioSource)
    audio: AudioSource = null;

    @property(AudioClip)
    jumpSound: AudioClip = null;

    @property(AudioClip)
    nagansound: AudioClip = null;
    
    @property(AudioClip)
    youxijieshusound: AudioClip = null; 
    
    @property(AudioClip)
    chenggansound: AudioClip = null;

    @property(AudioClip)
    fengsound: AudioClip = null;


    @property(Node)
    feng:Node=null;
    private donghuakongzhi:animation.AnimationController=null
    private ypos:number=-150;
    private accelerationset: number = 0;
    private speedset: number = 400;

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
private tiaoyuegaodu:number=866;   // 配合点击跳重力×3，保持原跳高(500²/2/400≈312.5)
private chumozhen_chenggan:number=null;
    private chengganStartX: number = 0;
    private playerInitPos: Vec3 = new Vec3();
    private zhangaiInit: ZhangaiInit[] = [];
    private fengInitPos: Vec3 = null;
private canchengsan:boolean=null;
private chumozhen_chengsan:number=null;
private canfeng:boolean=null;

private fengkeyiguo:boolean=null;
    private bgpos(deltaTime: number) {
        this.grasspos(deltaTime);
        this.buidingpos(deltaTime);
        this.cloudpos(deltaTime);
        this.player_y(deltaTime);
        this.player_x(deltaTime);
        this.fengdonghua(deltaTime);
    }
    private player_y(deltaTime: number){

        this.yspeed+=this.yacceleration*deltaTime;
        let ypos = this.player.getPosition().y + this.yspeed*deltaTime;
this.player.setPosition(this.player.getPosition().x,Math.max(ypos,this.ypos));

    }
    private player_x(deltaTime: number){
        if(this.is_dimian){
            if(this.is_chenggan){
                let x=this.player.getPosition().x-this.speed*deltaTime;
                this.player.setPosition(x, this.player.getPosition().y);
            
            
            }
            }
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
                const ganpoor = grassnode.getChildByName("gan&poor");
                if (ganpoor) {
                    this.suijizhangai(ganpoor);
                }
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
    protected onLoad() {
        if (this.player) {
            this.donghuakongzhi = this.player.getComponent(animation.AnimationController);
        }
    }

    start() {
         this.saveInitPos();
         this.baocunzhangai();
         this.eventlistener();
         this.donghuakongzhi=this.player.getComponent(animation.AnimationController)
         console.log("[game] start: donghuakongzhi =", this.donghuakongzhi);
         const fengNode = this.node.getChildByName("feng");
         if (fengNode) { this.fengInitPos = fengNode.getPosition().clone(); }
         this.player.getPosition(this.playerInitPos);
         this.initialize();
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
            this.shezhidonghua("has_gan", this.has_gan);
            this.playmusic(this.nagansound);    
        }else if(this.has_gan){
            if(!this.is_chenggan){
                this.chengganStartX = this.player.getPosition().x;
            }
            this.is_chenggan=true;
            this.shezhidonghua("is_chenggan", this.is_chenggan);
            this.playmusic(this.chenggansound);
        }else {
            
            this.yacceleration = this.yaccelerationset * 4;
            this.yspeed = this.tiaoyuegaodu;
            this.playmusic(this.jumpSound);
        }
    }else {
            if(!this.is_up){
                if(this.canchengsan){
                    this.is_chengsan=true;
                    this.yacceleration=this.yaccelerationset*0.35;
                    this.yspeed=this.yspeedset*0.4;
                    this.shezhidonghua("is_chengsan", this.is_chengsan);
                }
            }
        }
    }

    private touchend() {
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
        console.log("touchend");
        if(this.is_dimian){
            if(this.is_chenggan){
                this.is_chenggan=false;
                this.has_gan=false;
                this.shezhidonghua("has_gan",this.has_gan);
                this.shezhidonghua("is_chenggan", this.is_chenggan);
                console.log(this.chumozhen_chenggan);
                this.yspeed=this.chumozhen_chenggan*16;
                this.player.setPosition(this.chengganStartX,this.chumozhen_chenggan*3)
                this.playmusic(this.jumpSound);
            }
      }else{
        if(this.is_chengsan){
            this.is_chengsan=false;
            this.yacceleration=this.yaccelerationset;
            this.yspeed=this.yspeedset;
            this.shezhidonghua("is_chengsan", this.is_chengsan);
            this.is_feng=false;
            this.acceleration=this.accelerationset;
            this.shezhidonghua("is_feng", this.is_feng)
        }}
    }
    private touchcancel() {  
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }
        console.log("touchcancel");
      }    



      private _jisuanzhenshu_chengsan(){
    if(this.is_chengsan){
        this.chumozhen_chengsan = 0;
    }else{
        this.canchengsan = false;
        this.chumozhen_chengsan++;
        if(this.chumozhen_chengsan>20){
            this.canchengsan =true;
        }
    }
}

      private jisuanzhenshu() {
        if(this.is_dimian){
        if(!this.is_chenggan){
            this.chumozhen_chenggan=0
        }else{
            this.chumozhen_chenggan++
            if(this.chumozhen_chenggan>35){
                this.chumozhen_chenggan=0
                this.is_chengsan=false;
                this.has_gan=false;
                this.yspeed=50;
                this.player.setPosition(this.chengganStartX,this.ypos+150);
                 this.shezhidonghua("has_gan",this.has_gan);
                this.shezhidonghua("is_chenggan", this.is_chenggan);
            }
        }
      }
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
    private _jixuyouxi() {
        this.is_over=false;
        this.has_gan=false;
        this.is_chenggan=false;
        this.is_chengsan=false;
        this.is_feng=false;
        this.shezhidonghua("is_over", this.is_over);
        this.shezhidonghua("has_gan", this.has_gan);
        this.shezhidonghua("is_chenggan", this.is_chenggan);
        this.shezhidonghua("is_chengsan", this.is_chengsan);
        this.shezhidonghua("is_feng", this.is_feng);
        this.playbgm(true);
    }


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
        this.huifuzhangai();
        this.player.setPosition(this.playerInitPos);
        this.cannagan=false;
        this.mubiaoganzi=null;
        this.chengganStartX=this.playerInitPos.x;
        this.chumozhen_chenggan=0;
        this.chumozhen_chengsan=0;
        this.canchengsan=false;
        this.canfeng=true;
        this.fengkeyiguo=false;
        this.speed = this.speedset;
        this.acceleration = this.accelerationset;
        this.yspeed = this.yspeedset;
        this.yacceleration = this.yaccelerationset;
        this.is_up = false;
        const fengNode = this.node.getChildByName("feng");
        if (fengNode && this.fengInitPos) {
            fengNode.setPosition(this.fengInitPos);
        }
        this.is_over=false;
        this.has_gan=false;
        this.is_chenggan=false;
        this.is_chengsan=false;
        this.is_feng=false;
        this.shezhidonghua("is_over", this.is_over);
        this.shezhidonghua("has_gan", this.has_gan);
        this.shezhidonghua("is_chenggan", this.is_chenggan);
        this.shezhidonghua("is_chengsan", this.is_chengsan);
        this.shezhidonghua("is_feng", this.is_feng);
        this.playbgm(true);
    }
    private _onGameOver() {
        if(gamedata.instance.gamestate!=GameState.Playing){
            return;
        }

        if (!this.donghuakongzhi) { console.warn("[game] _onGameOver: donghuakongzhi 为 null"); }
        this.is_over=true;
        this.shezhidonghua("is_over", this.is_over);
        console.log("游戏结束, 当前分数: " + gamedata.instance.score + ", 最佳分数: " + gamedata.instance.bestscore);
        if (gamedata.instance.score >= gamedata.instance.bestscore) {
            gamedata.instance.bestscore = gamedata.instance.score;
            gamedata.instance.saveBestScore();
            console.log("保存最佳分数: " + gamedata.instance.bestscore);
            
        }
        gamedata.instance.gamestate=GameState.GameOver
        this.over.active = true;
        this.playbgm(false);
        this.playmusic(this.youxijieshusound);
    }
    private initialize() {
        this.gamestart.active = true;
         this.teach.active = false;
         this.over.active = false;
         gamedata.instance.gamestate = GameState.Start;
         gamedata.instance.loadBestScore();
         gamedata.instance.score = 0;
         this.score.string = "0";
         this.playbgm(true);
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

    private fengdonghua(deltaTime: number){
        const feng = this.feng || this.node.getChildByName("feng");
        if(!this.fengkeyiguo || !feng || !this.fengInitPos){
            return;
        }
        let x=feng.getPosition().x;
        let y=feng.getPosition().y;
        x-=800*deltaTime
        y-=300*deltaTime
        if(x<-530){
            x=this.fengInitPos.x;
            y=this.fengInitPos.y;
            this.fengkeyiguo=false;
        }
        feng.setPosition(x,y);
    }
    private state_panduan(){
        if(this.player.getPosition().y>this.ypos){
            this.is_dimian=false;
        }else{
            this.is_dimian=true;
            this.is_chengsan=false;
        this.is_feng=false;
        this.canfeng=true;
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
        if(this.canfeng){
        if(this.player.getPosition().y<260){

            if(this.is_chengsan){
                this.canfeng=false;
                this.is_feng=false;
                let a= Math.random()
                if(a<0.5){
                    this.is_feng=true;
                    this.acceleration=-15;
                    this.yacceleration=this.yaccelerationset*0.8;
                    this.fengkeyiguo=true;
                    this.playmusic(this.fengsound);
                }
            }

        }}

        this.shezhidonghua("is_dimian", this.is_dimian);
        this.shezhidonghua("is_up", this.is_up);
        this.shezhidonghua("has_gan", this.has_gan);
        this.shezhidonghua("is_chenggan", this.is_chenggan);
        this.shezhidonghua("is_chengsan", this.is_chengsan);
        this.shezhidonghua("is_feng", this.is_feng);

    }
    private suijizhangai(ganpoor: Node) {
        const gan = ganpoor.getChildByName("gan");
        const poor = ganpoor.getChildByName("poor");
        if (!gan || !poor) {
            return;
        }
        const ganzi = gan.getChildByName("ganzi");
        if (ganzi) {
            ganzi.active = true;
        }

        // 约 1/3 概率没有杆（隐藏 gan 及其碰撞盒）
        const noGan = Math.random() < 1 / 3;
        gan.active = !noGan;

        // poor 长度随机：改 scaleX（碰撞盒随节点缩放自动跟随）
        // 有杆时较长（难），无杆时较短（好跳）
        const s = noGan ? (0.8 + Math.random() * 0.7) : (1.2 + Math.random() * 1.3);
        poor.setScale(s, 1, 1);

        const ganCol = gan.getComponent(BoxCollider2D);
        const poorCol = poor.getComponent(BoxCollider2D);

        // gan 碰撞盒右边缘（gan&poor 坐标系）
        const ganCx = gan.getPosition().x + (ganCol ? ganCol.offset.x : 0);
        const ganHalf = ganCol ? ganCol.size.width / 2 : 0;
        const ganRight = ganCx + ganHalf;

        // poor 碰撞盒左边缘（offset 和半宽都随 scaleX 缩放）
        const poorCx = poor.getPosition().x + (poorCol ? poorCol.offset.x * s : 0);
        const poorHalf = poorCol ? (poorCol.size.width / 2) * s : 0;
        const poorLeft = poorCx - poorHalf;

        // 随机间距，保证 gan 不串进 poor
        const margin = 50 + Math.random() * 250;
        const newPoorX = poor.getPosition().x + (ganRight + margin - poorLeft);
        poor.setPosition(newPoorX, poor.getPosition().y);
        // 绕回安全：poor 太长时把 gan+poor 整体左移，保证模块绕回时 poor 已完全移出屏幕左侧
        const grassX = this.grass ? this.grass.getPosition().x : 0;
        const safeLimit = (-360 - grassX + 60) - 30;   // 模块局部坐标下的安全右界（绕回 x=-60，留 30 余量）
        const ganpoorX = ganpoor.getPosition().x;
        const poorUT = poor.getComponent(UITransform);
        const halfW = poorUT ? poorUT.contentSize.width / 2 : 250;
        const poorRight = ganpoorX + poor.getPosition().x + halfW * s;
        if (poorRight > safeLimit) {
            const over = poorRight - safeLimit;
            gan.setPosition(gan.getPosition().x - over, gan.getPosition().y);
            poor.setPosition(poor.getPosition().x - over, poor.getPosition().y);
        }
    }

    private baocunzhangai() {
        this.zhangaiInit = [];
        if (!this.grass) { return; }
        for (const grassnode of this.grass.children) {
            const ganpoor = grassnode.getChildByName("gan&poor");
            if (!ganpoor) { continue; }
            const gan = ganpoor.getChildByName("gan");
            const poor = ganpoor.getChildByName("poor");
            if (!gan || !poor) { continue; }
            const ganzi = gan.getChildByName("ganzi");
            this.zhangaiInit.push({
                gan, poor, ganzi,
                ganPos: gan.getPosition().clone(),
                poorPos: poor.getPosition().clone(),
                poorScale: poor.getScale().clone(),
                ganActive: gan.active,
                ganziActive: ganzi ? ganzi.active : true,
            });
        }
    }

    private huifuzhangai() {
        for (const item of this.zhangaiInit) {
            item.gan.setPosition(item.ganPos);
            item.poor.setPosition(item.poorPos);
            item.poor.setScale(item.poorScale);
            item.gan.active = item.ganActive;
            if (item.ganzi) { item.ganzi.active = item.ganziActive; }
        }
    }

    private chongzhiganzi() {
        if (!this.grass) {
            return;
        }
        for (const grassnode of this.grass.children) {
            const ganpoor = grassnode.getChildByName("gan&poor");
            if (!ganpoor) {
                continue;
            }
            const gan = ganpoor.getChildByName("gan");
            if (gan) {
                gan.active = true;
            }
            const ganzi = gan ? gan.getChildByName("ganzi") : null;
            if (ganzi) {
                ganzi.active = true;
            }
        }
    }

    private shezhidonghua(name: string, value: boolean) {
        if (this.donghuakongzhi) {
            this.donghuakongzhi.setValue(name, value);
        }
    }

    private playbgm(is_play: boolean) {
        if (!this.audio) { return; }
        try {
            if (is_play) {
                this.audio.play();
            } else {
                this.audio.stop();
            }
        } catch (e) {
            console.warn("播放音频失败:", e);
        }
    }
    private playmusic(clip: AudioClip) {
        if (!this.audio) { return; }
        this.audio.playOneShot(clip);
    }

    update(deltaTime: number) {
         this.speed+=this.acceleration*deltaTime;
      if(gamedata.instance.gamestate!=GameState.GameOver){
          this.bgpos(deltaTime);
      }
        this.state_panduan();
        this.jisuanzhenshu();
        this._jisuanzhenshu_chengsan();
}}