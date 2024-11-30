import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { RobotSeg } from "./RobotSeg";
import { Robot } from "./Robot";

export class Legs extends RobotSeg{
    public frontLeg: Phaser.GameObjects.Image;
    constructor(scene: GameScene, x: number, y: number, spr: string, owner: Robot){
        super(scene,x,y,owner);
        this.frontLeg = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.frontLeg.setOrigin(0.5,0);
        this.add(this.frontLeg);
    }
}