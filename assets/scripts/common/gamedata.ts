import { GameState } from "./gameconst";
import { sys } from 'cc';
export class gamedata {
private constructor() {}
private static _instance: gamedata = null;
public static get instance(): gamedata {
    if (!this._instance) {
        this._instance = new gamedata();
    }
    return this._instance;    
}
public score: number = 0;
public bestscore: number = 0;
public gamestate:   GameState = GameState.Start; // 0: 游戏未开始, 1: 游戏进行中, 2: 游戏结束

private static BEST_SCORE_KEY = "bestscore";

public loadBestScore(): void {
    const saved = sys.localStorage.getItem(gamedata.BEST_SCORE_KEY);
    if (saved !== null) {
        this.bestscore = parseInt(saved, 10) || 0;
    }
}

public saveBestScore(): void {
    sys.localStorage.setItem(gamedata.BEST_SCORE_KEY, this.bestscore.toString());
}


public allowagain: boolean = true; // 是否允许再次点击开始游戏
}