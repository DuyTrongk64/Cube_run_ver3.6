import { _decorator, Animation, Camera, CameraComponent, Collider, ColliderComponent, Component, Event, EventMouse, EventTouch, input, Input, MeshRenderer, misc, Node, Prefab, Quat, SystemEvent, tween, UITransform, Vec2, Vec3,BoxCollider,  ICollisionEvent, ITriggerEvent, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TestCollision')
export class TestCollision extends Component {
    protected speed: number;

    private canMove: boolean;

    private isTouch: boolean;

    // current character position
    private _curPos: Vec3 = new Vec3();
    // the difference in position of the current frame movement during each move
    private _deltaPos: Vec2 = new Vec2();
    // target position of the character
    private _targetPos: Vec3 = new Vec3();

    private interactableObject: MeshRenderer;
    onLoad() {
        //set up move object
        input.on(Input.EventType.TOUCH_START, this.onTouchBegan, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        

    }


    start() {
        this.speed = 5;
        this.canMove = false;
        this.isTouch = false;

        let collider = this.node.getComponent(Collider);
        collider.on('onCollisionEnter', this.onCollision, this);
    }

    private onCollision (event: ICollisionEvent) {
        console.log(event.type, event);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchBegan, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onStart() {

    }

    //bat dau an xuong
    onTouchBegan(event) {
        this.canMove = true;
        this.isTouch = true;
        this.node.getPosition(this._curPos);
        this.node.setRotation(new Quat(0, 1, 0, 0));
    }

    //di chuyen chuot
    onTouchMoved(event) {

        let touches = event.getTouches();

        let touch1 = touches[0];
        this._deltaPos = touch1.getDelta();

        // this.node.getPosition(this._curPos);

        // this._targetPos.x = this._curPos.x + delta1.x;

        // console.log(this._targetPos.x);


    }

    onTouchEnd(event) {
        this.isTouch = false;
    }

    startRun(deltaTime: number) {
        if (this.canMove) {

            let curPos = this.node.getPosition();
            curPos.z -= this.speed * deltaTime;
            this.node.setPosition(curPos);

        }
        if (this.isTouch) {
            this.node.getPosition(this._curPos);
            this._targetPos.x = this._deltaPos.x * deltaTime / 10;
            //console.log(this._deltaPos.x);
            Vec3.add(this._curPos, this._curPos, this._targetPos);
            this.node.setPosition(this._curPos);
        }
    }

    update(deltaTime: number) {
        this.startRun(deltaTime);
        //this.interactableObject.wo
    }
}


