import { Node, NodePool, Prefab, Vec3, instantiate } from 'cc';

export default class SimplePool {
    private static pools: Map<Prefab, NodePool> = new Map();

    static preload(prefab: Prefab, amount: number) {
        if (!this.pools.has(prefab)) {
            this.pools.set(prefab, new NodePool());
        }
        
        const pool = this.pools.get(prefab);

        for (let i = 0; i < amount; i++) {
            const newNode = instantiate(prefab);
            pool.put(newNode);
        }
    }

    static spawn(prefab: Prefab, root: Node, position: Vec3): Node | null {
        if (!this.pools.has(prefab)) {
            console.error("Prefab has not been preloaded.");
            return null;
        }

        const pool = this.pools.get(prefab);
        let newNode: Node = null;

        if (pool.size() > 0) {
            newNode = pool.get();
        } else {
            newNode = instantiate(prefab);
        }

        if (newNode) {
            root.addChild(newNode);
            newNode.setPosition(position);

        }

        return newNode;
    }

    static despawn(prefab: Prefab, node: Node) {
        if (!this.pools.has(prefab)) {
            console.error("Prefab has not been preloaded.");
            return;
        }

        const pool = this.pools.get(prefab);
        if (pool && node.isValid) {
            node.removeFromParent();
            pool.put(node);
        }
    }
}