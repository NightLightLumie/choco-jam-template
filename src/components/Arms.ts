import { LEFT, RIGHT } from "phaser";
import { RobotSeg } from "./RobotSeg";
import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { Robot } from "./Robot";
import { BasicAnim } from "./BasicAnim";
import { Projectile } from "./Projectile";
import { ProjectileData } from "./Projectile";

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

private rotationTarget: number = 0;
private finishedRotation = true;
private rotationTracker: number = 0;
private statRotAdj: number = 90;

    constructor(scene:GameScene, x: number, y:number, spr: string, owner: Robot, direction: number) {
        super(scene,x,y,owner, direction);
        this.frontArm = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.frontArm.setOrigin(0.5,0);
        this.add(this.frontArm);
        this.myPartID = 2;
        //this.backArm = new Phaser.GameObjects.Image(scene,0,0,spr);
        //this.backArm.setOrigin(0.5,0);
    }

    tick(t: number, d: number){
        super.tick(t,d);
        this.processScript(t,d);
        this.processRotation(t,d);
    }

    setScript(scr: string){
        this.activeScript = scr;
        switch(this.activeScript){
            case "rocketpunch": {
                this.owner.bringToFront(this.myPartID);
                this.curSt = 0;
                this.stVars = [0];
                this.inAttackSequence = true;
                let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                this.rotationSpeed = 360;
                this.rotationTarget = this.normalizeAngle(Phaser.Math.RadToDeg(tx)+(this.direction*this.statRotAdj));
                this.finishedRotation = false;
                break;
            } case "fireblast": {
                this.owner.bringToFront(this.myPartID);
                this.curSt = 0;
                this.stVars = [0];
                this.inAttackSequence = true;
                let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                this.rotationSpeed = 360;
                this.rotationTarget = this.normalizeAngle(Phaser.Math.RadToDeg(tx)+(this.direction*this.statRotAdj));
                this.finishedRotation = false;
                break;
            } case "scan": {
                break;
            } default: {
                break;
            }
        }
    }

    normalizeAngle(theta: number): number{
        if((theta > 360) || (theta < -360)){
            theta = theta%360;
        }
        if(theta == 360 || theta == -360) {
            return 0;
        }
        if(theta > 180) {
            let rt = theta-180;
            return (-180+rt);
        } else if (theta <-180) {
            let rx = theta+180;
            return (180+rx);
        } else {
            return theta;
        }
    }

    processScript(t: number, d: number){
        if(!this.inAttackSequence) {
            //console.log("Not in attack sequence");
            return;
        }
        switch(this.activeScript){
            case "rocketpunch": {
                this.processRocketPunch(t, d);
                break;
            } case "fireblast": {
                this.processFireBlast(t,d);
                break;
            } case "scan": {
                break;
            } default: {
                break;
            }
        }
    }

    processRocketPunch(t: number, d: number){
        switch(this.curSt){
            case 0: {
                if(this.finishedRotation){
                    this.curSt = 1;
                    this.stVars = [125];
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 2;
                    this.stVars = [200, 0.5+Math.abs(Math.hypot((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])))/256)-1];
                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                if(this.stVars[0] > 0) {
                    this.setScale(1,1+(this.stVars[1]*(1-(this.stVars[0]/200))));
                } else {
                    this.setScale(1,1+this.stVars[1]);
                    this.curSt = 3;
                    this.stVars = [500, this.scaleY-1];
                    this.scene.sound.play("punch",{volume: 1});
                }
                break;
            } case 3: {
                this.stVars[0] -= d;
                if(this.stVars[0] > 0) {
                    this.setScale(1,1+(this.stVars[1]*(this.stVars[0]/500)));
                } else {
                    this.setScale(1,1);
                    this.curSt = 4;
                    this.stVars = [];
                    this.rotationSpeed = 360;
                    this.rotationTarget = 0;
                    this.finishedRotation = false;
                }
                break;
            } case 4: {
                if(this.finishedRotation) {
                    this.curSt = 0;
                    this.stVars = []
                    this.rotationSpeed = 0;
                    this.rotationTarget = 0;
                    this.finishedRotation = true;
                    this.owner.reorderParts();
                    this.inAttackSequence = false;
                }
                break;
            } default: {
                break;
            }
        }
    }

    processFireBlast(t: number, d: number){
        switch(this.curSt){
            case 0: {
                if(this.finishedRotation){
                    this.curSt = 1;
                    this.stVars = [300];
                    this.animObjects.push(new BasicAnim(this.scene, 0, 240,"flare",2,75,1,true,0,0,[0.5,0.5]));
                    this.add(this.animObjects[0]);
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.stVars = [300];
                    this.curSt = 2;
                    let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1]-10)),(this.scene.getTargetX()-(this.owner.x+this.initPos[0]-48)));
                    let ty = Math.hypot((this.scene.getTargetY()-(this.owner.y+this.initPos[1]-10)),(this.scene.getTargetX()-(this.owner.x+this.initPos[0]-48)));
                    this.lockProgress = 1;
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]+64*Math.cos(tx)),(this.owner.y+this.initPos[1]+240*Math.sin(tx)),
                    this,"fireball",2,250,"fireball",{
                        vx: Math.cos(tx)*1600,
                        vy: Math.sin(tx)*1600,
                        rotation: tx*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetX(),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.75,0.5],
                        target: [this.direction,this.scene.getActivePartID()],     
                    }));
                    this.scene.sound.play("fireblast", {volume: 0.35});
                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                if(this.stVars[0] > 0) {
                    if(this.animObjects.length > 0){
                        this.animObjects[0].setAlpha(this.stVars[0]/300);
                    }
                } else {
                    this.clearAnims();
                    if(this.lockProgress == 0) {
                        this.curSt = 3;
                        this.stVars = [];
                        this.rotationSpeed = 360;
                        this.rotationTarget = 0;
                        this.finishedRotation = false;
                    }
                }
                break;
            } case 3: {
                if(this.finishedRotation) {
                    this.curSt = 4;
                    this.stVars = [200];
                }
            } case 4: {
                this.stVars[0] -= d;
                if (this.stVars[0] <= 0){
                    this.curSt = 0;
                    this.stVars = [];
                    this.clearAnims();
                    this.rotationSpeed = 0;
                    this.rotationTarget = 0;
                    this.finishedRotation = true;
                    this.lockProgress = 0;
                    this.owner.reorderParts();
                    this.inAttackSequence = false;
                }
                break;
            } default: {
                break;
            }
        }
    }

    processMissile(t: number, d: number){
        switch(this.curSt){
            case 0: {
                if(this.finishedRotation){
                    this.curSt = 1;
                    this.stVars = [300];
                    this.animObjects.push(new BasicAnim(this.scene, 0, 240,"flare",2,75,1,true,0,0,[0.5,0.5]));
                    this.add(this.animObjects[0]);
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.stVars = [300];
                    this.curSt = 2;
                    let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1]-10)),(this.scene.getTargetX()-(this.owner.x+this.initPos[0]-48)));
                    let ty = Math.hypot((this.scene.getTargetY()-(this.owner.y+this.initPos[1]-10)),(this.scene.getTargetX()-(this.owner.x+this.initPos[0]-48)));
                    this.lockProgress = 1;
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]+64*Math.cos(tx)),(this.owner.y+this.initPos[1]+240*Math.sin(tx)),
                    this,"fireball",2,250,"fireball",{
                        vx: Math.cos(tx)*1600,
                        vy: Math.sin(tx)*1600,
                        rotation: tx*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetX(),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.75,0.5],
                        target: [this.direction,this.scene.getActivePartID()],     
                    }));
                    this.scene.sound.play("fireblast", {volume: 0.35});
                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                if(this.stVars[0] > 0) {
                    if(this.animObjects.length > 0){
                        this.animObjects[0].setAlpha(this.stVars[0]/300);
                    }
                } else {
                    this.clearAnims();
                    if(this.lockProgress == 0) {
                        this.curSt = 3;
                        this.stVars = [];
                        this.rotationSpeed = 360;
                        this.rotationTarget = 0;
                        this.finishedRotation = false;
                    }
                }
                break;
            } case 3: {
                if(this.finishedRotation) {
                    this.curSt = 4;
                    this.stVars = [200];
                }
            } case 4: {
                this.stVars[0] -= d;
                if (this.stVars[0] <= 0){
                    this.curSt = 0;
                    this.stVars = [];
                    this.clearAnims();
                    this.rotationSpeed = 0;
                    this.rotationTarget = 0;
                    this.finishedRotation = true;
                    this.lockProgress = 0;
                    this.owner.reorderParts();
                    this.inAttackSequence = false;
                }
                break;
            } default: {
                break;
            }
        }
    }
    
    inform(tag: string){
        switch(tag){
            case "fireball": {
                this.lockProgress = 0;
                break;
            } default: {
                break;
            }
        }
    }

    processRotation(t: number, d: number){
        if(this.finishedRotation) {
            return;
        } else {
            if(this.rotationTarget > this.angle) {
                this.setAngle(this.angle+(this.rotationSpeed*(d/1000)));
                //console.log("ANGLE: " + this.angle);
                if(this.angle >= this.rotationTarget) {
                    this.setAngle(this.rotationTarget);
                    this.finishedRotation = true;
                }
            } else if (this.rotationTarget < this.angle) {
                this.setAngle(this.angle-(this.rotationSpeed*(d/1000)));
                //console.log("ANGLE: " + this.angle);
                if(this.angle <= this.rotationTarget) {
                    this.setAngle(this.rotationTarget);
                    this.finishedRotation = true;
                }
            } else {
                this.finishedRotation = true;
            }
        }
    }

    rotateToPosition(pos: number){

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