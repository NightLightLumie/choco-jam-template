import { GameScene } from "@/scenes/GameScene";
import { RobotSeg } from "./RobotSeg";

export class Familiar extends Phaser.GameObjects.Container{
    public owner: RobotSeg;
    public direction: number;
    public deleteFlag: boolean = false;
    constructor(scene:GameScene, x: number, y: number, owner: RobotSeg, dir: number){
        super(scene,x,y);
        this.owner=owner;
        this.direction=dir;

    }

    tick(t: number, d: number){
        
    }    

}