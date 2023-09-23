import { _decorator, Component, instantiate, Node, NodePool, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test_touch')
export class Test_touch extends Component {
     // singleton
     private static ins: Test_touch;

     public static get Ins(): Test_touch {
         return Test_touch.ins;
     }
     
    @property([Prefab])  // Chú ý dấu [] ở đây để chỉ ra rằng đây là một mảng Prefab
    prefabList: Prefab[] = [];

    @property(Node)
    par: Node = null;

    // Mảng NodePool cho từng prefab tương ứng
    nodePools: NodePool[] = [];

    onLoad(): void {
        // Khởi tạo các node pool cho từng prefab
        for (let i = 0; i < this.prefabList.length; i++) {
            const nodePool = new NodePool();
            this.nodePools.push(nodePool);

            // Preload pool
            for (let j = 0; j < 5; j++) {  // Số lượng preload tùy ý
                const newNode = instantiate(this.prefabList[i]);
                nodePool.put(newNode);
            }
        }
    
    }

    spawn(prefabIndex: number,pos: Vec3){
        // Lấy một node từ node pool và thêm vào parent
        const n1 = this.nodePools[prefabIndex].get();
        
        if (n1) {
            this.par.addChild(n1);
            n1.setPosition(pos);
        }
    }

    despawn(prefabIndex: number, targetNode: Node){
        this.nodePools[prefabIndex].put(targetNode);
    }
}