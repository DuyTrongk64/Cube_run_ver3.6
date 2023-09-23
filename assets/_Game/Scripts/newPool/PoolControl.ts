import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import SimplePool from './SimplePool';
const { ccclass, property } = _decorator;

@ccclass
export default class PoolControl extends Component {
    @property([Prefab])
    prefabList: Prefab[] = [];

    @property(Node)
    par: Node = null;

    onLoad() {
        for (let i = 0; i < this.prefabList.length; i++) {
            const prefab = this.prefabList[i];
            SimplePool.preload(prefab,5); // Số lượng preload tùy ý
        }
    }

    spawn(prefabIndex: number, pos: Vec3) {
        const prefab = this.prefabList[prefabIndex];
        SimplePool.spawn(prefab, this.par, pos);
    }

    despawn(prefabIndex: number, targetNode: Node) {
        const prefab = this.prefabList[prefabIndex];
        SimplePool.despawn(prefab, targetNode);
    }
}