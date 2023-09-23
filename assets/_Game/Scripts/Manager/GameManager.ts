import { _decorator, Camera, Component, game, Game, Node, Vec3 } from 'cc';
import { Player } from '../Player';
import { Camera3d } from '../Camera3d';
import PoolControl from '../newPool/PoolControl';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // singleton
    private static ins: GameManager;

    public static get Ins(): GameManager {
        return GameManager.ins;
    }

    protected onLoad(): void {
        GameManager.ins = this;
    }

    @property(PoolControl)
    poolControl: PoolControl = null;

    public endRun: boolean;
    public coutPlayer: number;

    public sumPlayer: number = 1;

    public selectedBoss: boolean;

    @property(Node)
    public player_field: Node[] = [];

    @property(Node)
    public spawn_point: Node[] = [];

    @property(Camera)
    public camera3d!: Camera3d;

    @property(Camera)
    public camera2d!: Camera;

    public playerList: Array<Player> = [];

    @property(Node)
    public selectScene!: Node;

    start() {
        this.coutPlayer = 1;
        this.endRun = false;
        this.spawnPlayer();
        this.camera2d.enabled = false;
        this.selectedBoss = false;
    }

    update(deltaTime: number) {
        if (this.coutPlayer == 0){
            console.log("pause game");
            game.pause();
        }

        if(this.endRun){
            let curPos = this.camera3d.node.getPosition();
            curPos.y = 35.697;
            curPos.z = -115.947;
            this.camera3d.node.setPosition(curPos);
            this.camera3d.node.setRotationFromEuler(-29.148,0,0);
            this.camera3d.canMove = false;
        }
    }

    // Khi bạn muốn spawn prefab
    spawnPrefab(prefabIndex: number, position: Vec3) {
        this.poolControl.spawn(prefabIndex, position);
    }

    // Khi bạn muốn despawn prefab
    despawnPrefab(prefabIndex: number, targetNode: Node) {
        this.poolControl.despawn(prefabIndex, targetNode);
    }

    spawnPlayer(){
        for(let i =0;i<this.spawn_point.length;i++){
            this.spawnPrefab(0,this.spawn_point[i].getPosition());
        }
    }

    spawnBoss(id: number){
        this.camera2d.enabled = false;
        //this.selectScene.active = false;
        this.poolControl.spawn(id,new Vec3(0,1.019,-180));
        this.selectedBoss = true;
    }

    
}


