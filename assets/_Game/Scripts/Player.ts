import { _decorator, Animation, Node, Camera, Collider, Component, geometry, input, Input, EventTouch, PhysicsSystem, Quat, SystemEvent, tween, UITransform, Vec2, Vec3, BoxCollider, ICollisionEvent, ITriggerEvent, director, RigidBody, physics, debug, CameraComponent, find, game } from 'cc';
import { GameManager } from './Manager/GameManager';

const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property({ type: Animation })
    anim: Animation | null = null;

    @property(Number)
    state: number = 0;

    private hp: number;

    private speed: number;

    private canMove: boolean;

    private isTouch: boolean;

    private newPlayer: boolean;

    private endRun: boolean;

    private targetPlayer: boolean;

    protected id: number = 1;

    private selectedBoss: boolean;

    // current character position
    private _curPos: Vec3 = new Vec3();
    // the difference in position of the current frame movement during each move
    private _deltaPos: Vec2 = new Vec2();
    // target position of the character
    private _targetPos: Vec3 = new Vec3();

    // Specify the camera rendering the target node.
    @property(Camera)
    private cameraCom!: Camera;

    private _ray: geometry.Ray = new geometry.Ray();

    @property
    public level: number = 1;

    onLoad() {
        //set up move object
        input.on(Input.EventType.TOUCH_START, this.onTouchBegan, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        PhysicsSystem.instance
        // Xử lý sự kiện va chạm
        let collider = this.node.getComponent(Collider);

        // Listening to 'onCollisionStay' Events
        collider.on('onCollisionEnter', this.onCollision, this);


    }


    start() {
        if (this.state === 0) {
            GameManager.Ins.playerList.push(this);
        }
        //set up for high level player
        if (this.level > 1) {
            this.endRun = true;
            this.canMove = false;
        }
        else {
            this.hp = 5;
            this.speed = 10;
            this.canMove = false;
            this.newPlayer = false;
            this.endRun = false;

        }
        this.isTouch = false;
        this.targetPlayer = false;
        this.cameraCom = find("Main Camera").getComponent(Camera);
        this.selectedBoss = false;
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchBegan, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onCollision(event: ICollisionEvent) {

        //console.log(event.otherCollider.getComponent(RigidBody).group);
        if (this.state == 1) {
            this.canMove = true;
            this.newPlayer = true;
            this.node.getPosition(this._curPos);
            this.node.setRotation(new Quat(0, 1, 0, 0));
            this.state = 0;
            this.anim.play('run');
            GameManager.Ins.coutPlayer++;
            GameManager.Ins.sumPlayer++;
            this.id = GameManager.Ins.sumPlayer;
            GameManager.Ins.playerList.push(this);
            console.log(`${GameManager.Ins.playerList.length}`)
            //console.log(GameManager.Ins.coutPlayer);
            //console.log(`group: ${event.otherCollider.getComponent(RigidBody).group}`);
        }
        //console.log(event.otherCollider.getComponent(RigidBody).group);
        if (event.otherCollider.getComponent(RigidBody).group == 8) {
            this.node.active = false;
            GameManager.Ins.coutPlayer--;
            GameManager.Ins.playerList.splice(this.id - 1, 1);
            //console.log(GameManager.Ins.coutPlayer);
        }

        if (event.otherCollider.name == 'End<BoxCollider>') {
            for (let i = 0; i < GameManager.Ins.coutPlayer; i++) {
                console.log(GameManager.Ins.playerList[i].node.name);
                GameManager.Ins.playerList[i].moveTo(GameManager.Ins.player_field[i].getWorldPosition(), 1);
                //GameManager.Ins.playerList[i].node.name;
                GameManager.Ins.playerList[i].canMove = false;
                GameManager.Ins.playerList[i].anim.play('idle');
                GameManager.Ins.playerList[i].node.setRotation(new Quat(0, 0, 0, 0));
                GameManager.Ins.playerList[i].endRun = true;
            }
            GameManager.Ins.endRun = true;
            //this.waitAndExecute(()=>this.onEndRun());
        }

        if (this.endRun) {

            //console.log(event.otherCollider.getComponent(Player));
            if (event.otherCollider.getComponent(Player) != null) {
                if (event.otherCollider.getComponent(Player).level == this.level) {
                    //console.log("test");
                    if (this.targetPlayer) {
                        GameManager.Ins.despawnPrefab(this.level - 1, this.node);
                        GameManager.Ins.despawnPrefab(this.level - 1, event.otherCollider.getComponent(Player).node);
                        GameManager.Ins.spawnPrefab(this.level, event.otherCollider.getComponent(Player).node.getPosition());
                        this.destroy();
                    }
                }
            }

        }
    }

    //bat dau an xuong
    onTouchBegan(event: EventTouch) {

        if (this.state == 0 && !this.endRun) {

            this.canMove = true;
            this.isTouch = true;
            this.node.getPosition(this._curPos);
            this.node.setRotation(new Quat(0, 1, 0, 0));
            //console.log(this.endRun);

            this.anim.play('run');
        }

        if (this.endRun && this.selectedBoss) {
            const touch = event.touch!;
            //chuyển điểm từ world point sang màn hình
            this.cameraCom.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);
            if (PhysicsSystem.instance.raycast(this._ray)) {
                const raycastResults = PhysicsSystem.instance.raycastResults;
                for (let i = 0; i < raycastResults.length; i++) {
                    const item = raycastResults[i];
                    if (item.collider.node == this.node) {
                        this.targetPlayer = true;
                        // console.log(`id: ${this.id}`);
                        // console.log(`index: ${GameManager.Ins.playerList.indexOf(this)}`);
                        // console.log(`list length: ${GameManager.Ins.playerList.length}`);
                        // console.log("......................")
                        break;
                    }
                }
            }

        }
    }

    //di chuyen chuot
    onTouchMoved(event) {
        let touches = event.getTouches();

        let touch1 = touches[0];
        this._deltaPos = touch1.getDelta();
        if (this.newPlayer) {
            this.isTouch = true;
        }
    }

    onTouchEnd(event) {
        this.isTouch = false;
        this.targetPlayer = false;
    }

    startRun(deltaTime: number) {
        if (this.canMove) {
            let curPos = this.node.getPosition();
            curPos.z -= this.speed * deltaTime;
            this.node.setPosition(curPos);

        }
        if (this.isTouch && !this.endRun) {
            this.node.getPosition(this._curPos);
            this._targetPos.x = this._deltaPos.x * deltaTime;
            //console.log(this._deltaPos.x);
            Vec3.add(this._curPos, this._curPos, this._targetPos);
            this.node.setPosition(this._curPos);
        }
    }

    movePlayer(deltaTime: number) {
        if (this.targetPlayer && this.endRun) {
            this.node.getPosition(this._curPos);
            this._targetPos.x = this._deltaPos.x * deltaTime;
            this._targetPos.z = -this._deltaPos.y * deltaTime;
            //console.log(this._deltaPos.x);
            Vec3.add(this._curPos, this._curPos, this._targetPos);
            this.node.setPosition(this._curPos);
        }

    }

    moveTo(target: Vec3, duration: number): void {
        // Tạo một tween để di chuyển node từ vị trí hiện tại đến vị trí mới (position)
        tween(this.node)
            .to(duration,
                { position: target },
                { easing: "linear", }
            )
            .start();
    }

    // Hàm chờ
    waitAndExecute(callback: () => void) {
        setTimeout(() => {
            callback(); // Gọi hàm callback sau khi chờ
        }, 1800);
    }

    onEndRun(){
        GameManager.Ins.camera2d.enabled = true;
    }

    update(deltaTime: number) {
        this.startRun(deltaTime);   
        this.movePlayer(deltaTime);
        this.selectedBoss = GameManager.Ins.selectedBoss;
    }
}