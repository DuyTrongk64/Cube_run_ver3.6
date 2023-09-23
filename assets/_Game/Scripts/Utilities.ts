import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Utilities')
export class Utilities extends Component {
    
    //chuyen vector 3 sang vector 2
  public static vec3ToVec2(v: Vec3) : Vec2{
    return new Vec2(v.x, v.y);
  }

  //chuyen vector 2 sang vector 3
  public static vec2ToVec3(v: Vec2) : Vec3{
    return new Vec3(v.x, v.y, 0);
  }
}

