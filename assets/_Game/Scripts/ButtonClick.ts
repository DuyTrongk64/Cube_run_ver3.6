import { _decorator, Component, Node } from 'cc';
import { GameManager } from './Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonClick')
export class ButtonClick extends Component {
    
    button1(){
        GameManager.Ins.spawnBoss(3);
    }

    button2(){
        GameManager.Ins.spawnBoss(4);
    }

}


