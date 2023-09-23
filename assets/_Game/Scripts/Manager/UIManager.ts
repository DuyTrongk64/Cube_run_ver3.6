import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    // singleton
    private static ins : UIManager;
    public static get Ins() : UIManager
    {
       return UIManager.ins;
    }
 
    protected onLoad(): void {
        UIManager.ins = this;

        for (let i = 0; i < this.prefabs.length; i++){
            this.roots[i] = new Node();
            this.roots[i].setParent(this.node);
        }
    }
    //------------------------------------
    
    // open UI theo index, UI nào thứ tự càng cao thì layer càng cao
    // close UI cũng theo index luôn
    // UI có nút bấm nào thì nên tạo 1 function rồi kéo thả vào trong này, ví dụ như ấn end card button

    // prefab để show ui lên
    @property([Prefab])
    prefabs : Node[] = [];

    //list roots node để show layer theo đúng thứ tự mong muốn
    roots : Node[] = [];

    //list canvas để lấy link
    canvas : Node[] = [];

    //open theo index
    public onOpen(index: number){
        if(this.canvas[index] == null) {
            this.canvas[index] = instantiate(this.prefabs[index]);
            this.canvas[index].setParent(this.roots[index]);
        }

        this.canvas[index].active = true;
    }

    //close theo index
    public onClose(index: number){
        if(this.canvas[index] != null){
            this.canvas[index].active = false;
        }
    }

    public endcardButton(){
        
    }
}


