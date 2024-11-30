import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { RobotSeg } from "./RobotSeg";
import { Robot } from "./Robot";

export class Torso extends RobotSeg{
    public mySpr: Phaser.GameObjects.Image;
    constructor(scene: GameScene, x: number, y: number, spr: string, owner: Robot){
        super(scene,x,y,owner);
        this.mySpr = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.mySpr.setOrigin(0.5,0.5);
        this.mySpr.setScale(1.15,1.15);
        this.add(this.mySpr);

    }
}