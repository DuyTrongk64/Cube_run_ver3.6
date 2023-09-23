import { _decorator, Component, misc, Node, Vec3 } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Camera3d')
export class Camera3d extends Component {

    @property(Node)
    player: Node = null;

    public canMove: boolean;
    private speed: number;
    private totalTime: number;

    start() {
        this.speed = 10;
        this.totalTime = 0;
        this.canMove = true;
    }

    // getPosition(){
    //     return this.node.getPosition();
    // }
    // setPosition(pos: Vec3){
    //     this.node.setPosition(pos);
    // }

    startMove(deltaTime: number) {
        if (this.canMove) {
            let curPos = this.node.getPosition();
            curPos.z -= this.speed * deltaTime;
            this.node.setPosition(curPos);
        }

    }
    update(deltaTime: number) {
        let curPlPos = this.player.getPosition();
        if (curPlPos.z <= -5) {
            this.startMove(deltaTime);
        }
    }
}

