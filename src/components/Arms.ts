import { LEFT, RIGHT } from "phaser";
import { RobotSeg } from "./RobotSeg";
import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { Robot } from "./Robot";

export class Arms extends RobotSeg{
private static LEFT = 1;
private static RIGHT = -1;
private playerSide: number;

private frontArm: Phaser.GameObjects.Image;
private backArm: Phaser.GameObjects.Image;

//initial arm position and rotation variables
private initPosition: number[] = [];
private initAngle: number = 0;
private armPositions: number[] = [0,0];
private extendSpeed: number = 4;
private retractSpeed: number = 2;
private rotationSpeed: number = 360;

private finishedRotation = true;
private rotationTracker: number = 0;

    constructor(scene:GameScene, x: number, y:number, spr: string, owner: Robot) {
        super(scene,x,y,owner);
        this.frontArm = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.frontArm.setOrigin(0.5,0);
        this.add(this.frontArm);
        //this.backArm = new Phaser.GameObjects.Image(scene,0,0,spr);
        //this.backArm.setOrigin(0.5,0);
    }

    rotateForward(t: number){
        this.rotationTracker += (this.playerSide*this.rotationSpeed);
        if(this.playerSide == LEFT) {
            if(this.rotationTracker >= 90) {
                this.rotationTracker = 90;
                this.finishedRotation = true;
            } 
        } else if (this.playerSide == RIGHT) {
            if(this.rotationTracker <= -90) {
                this.rotationTracker = -90;
                this.finishedRotation = true;
            }
        }
        this.frontArm.setAngle(this.initAngle+this.rotationTracker);

    }
    
    extend(){

    }

    retract(){

    }
}