import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { RobotSeg } from "./RobotSeg";
import { Robot } from "./Robot";
import { Projectile } from "./Projectile";
import { ProjectileData } from "./Projectile";
import { BasicAnim } from "./BasicAnim";
import { Pan } from "./Pan";

export class Torso extends RobotSeg{
    public mySpr: Phaser.GameObjects.Image;
    constructor(scene: GameScene, x: number, y: number, spr: string, owner: Robot, direction: number){
        super(scene,x,y,owner, direction);
        this.mySpr = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.mySpr.setOrigin(0.5,0.5);
        this.mySpr.setScale(1.15,1.15);
        this.add(this.mySpr);
        this.myPartID = 1;

    }

    tick(t: number, d: number){
        super.tick(t,d);
        this.processScript(t,d);
    }

    setScript(scr: string){
        this.activeScript = scr;
        switch(this.activeScript){
            case "saw": {
                this.owner.bringToFront(this.myPartID);
                this.curSt = 0;
                this.stVars = [650];
                this.animObjects.push(new BasicAnim(this.scene,0,0,"door",5,100,1,false,0,0,[0.5,0.5]));
                this.scene.sound.play("turret", {volume: 1.5});
                this.animObjects[0].holdLastFrame = true;
                this.add(this.animObjects[0]);
                this.inAttackSequence = true;
                break;
            } case "pans": {
                this.owner.bringToFront(this.myPartID);
                this.curSt = 0;
                this.stVars = [650];
                this.animObjects.push(new BasicAnim(this.scene,0,0,"door",5,100,1,false,0,0,[0.5,0.5]));
                this.scene.sound.play("turret", {volume: 1.5});
                this.animObjects[0].holdLastFrame = true;
                this.add(this.animObjects[0]);
                this.inAttackSequence = true;
                break;
            } case "fireblast": {
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
            case "saw": {
                this.processSaw(t,d);
                break;
            } case "pans": {
                this.processPans(t,d);
            } case "fireblast": {
                //this.processFireBlast(t,d);
                break;
            } case "scan": {
                break;
            } default: {
                break;
            }
        }
    }

    inform(tag: string){
        switch(tag){
            case "saw": {
                this.lockProgress = 0;
                break;
            } case "pan": {
                this.lockProgress--;
                break;
            } default: {
                break;
            }
        }
    }

    processSaw(t: number, d: number){
        switch(this.curSt){
            case 0:{
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 1;
                    this.stVars = [300];
                    let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                    this.lockProgress = 1;
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]),(this.owner.y+this.initPos[1]),
                    this,"saw",2,125,"saw",{
                        vx: Math.cos(tx)*2000,
                        vy: Math.sin(tx)*2000,
                        rotation: tx*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetX(),
                        spin: 1440*this.direction,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.5,0.5],
                        target: [this.direction,this.scene.getActivePartID()],     
                    }));
                    this.scene.sound.play("saw", {volume: 0.25});
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
                    if(this.animObjects.length > 0) {
                        this.animObjects[0].deleteFlag = true;
                        this.clearAnims();
                    }
                    if(this.lockProgress <= 0){
                        this.curSt = 2;
                        this.stVars = [125];
                    }
                } else {
                    if(this.animObjects.length > 0) {
                        this.animObjects[0].setAlpha(this.stVars[0]/300);
                    }
                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 0;
                    this.stVars = [];
                    this.lockProgress = 0;
                    this.clearAnims();
                    this.owner.reorderParts();
                    this.inAttackSequence = false;
                }
                break;
            } default: {
                break;
            }
        }
    }

    processPans(t: number, d: number){
        switch(this.curSt){
            case 0:{
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 1;
                    this.stVars = [500];
                    let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                    this.lockProgress = 2;
                    this.scene.addProjectile(new Pan(this.scene,(this.owner.x+this.initPos[0]),(this.owner.y+this.initPos[1]),
                    this,"pan",2,125,"pan",{
                        vx: Math.cos(tx)*1400,
                        vy: Math.sin(tx)*1400,
                        rotation: tx*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetX(),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.5,0.5],
                        target: [this.direction,this.scene.getActivePartID()],},
                    0.5, 0));
                    this.scene.sound.play("panthrow", {volume: 0.5});
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
                    let tp = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                    this.scene.addProjectile(new Pan(this.scene,(this.owner.x+this.initPos[0]),(this.owner.y+this.initPos[1]),
                    this,"pan",2,125,"pan",{
                        vx: Math.cos(tp)*1400,
                        vy: Math.sin(tp)*1400,
                        rotation: tp*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetX(),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.5,0.5],
                        target: [this.direction,this.scene.getActivePartID()],},    
                    0, 1));
                    this.scene.sound.play("panthrow", {volume: 0.5});
                    this.curSt = 2;
                    this.stVars = [300]
                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
                    if(this.animObjects.length > 0) {
                        this.animObjects[0].deleteFlag = true;
                        this.clearAnims();
                    }
                    if(this.lockProgress <= 0){
                        this.curSt = 3;
                        this.stVars = [125];
                    }
                } else {
                    if(this.animObjects.length > 0) {
                        this.animObjects[0].setAlpha(this.stVars[0]/300);
                    }
                }
                break;
            } case 3: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 0;
                    this.stVars = [];
                    this.lockProgress = 0;
                    this.clearAnims();
                    this.owner.reorderParts();
                    this.inAttackSequence = false;
                }
                break;
            } default: {
                break;
            }
        }
    }
}