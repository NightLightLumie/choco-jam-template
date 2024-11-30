import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { RobotSeg } from "./RobotSeg";
import { Robot } from "./Robot";
import { BasicAnim } from "./BasicAnim";
import { Projectile } from "./Projectile";
import { ProjectileData } from "./Projectile";

export class Head extends RobotSeg{
    public mySpr: Phaser.GameObjects.Image;
    public setAttack: boolean = false;
    public atkVars: number[] = [];
    public scene: GameScene;
    //public scanArc: Phaser.GameObjects.Arc;
    //handle attacks

    constructor(scene: GameScene, x: number, y: number, spr: string, owner: Robot){
        super(scene,x,y, owner);
        this.scene = scene;
        this.mySpr = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.mySpr.setOrigin(0.5,0.5);
        //this.scanArc = new Phaser.GameObjects.Arc(scene,0,0,1,-1,1,false,0xa6fff3,0.75);
        //this.scanArc.setVisible(false);
        this.add(this.mySpr);
        /*
        this.myGraphics.clear();
        this.myGraphics.fillStyle(0xa6fff3, 0.9);
        this.myGraphics.slice(0,0,750,Phaser.Math.DegToRad(135), Phaser.Math.DegToRad(225),false,0);
        this.myGraphics.fillPath();
        */
    }

    tick(t: number, d: number){
        super.tick(t,d);
        this.processScript(t,d);
    }

    setScript(scr: string){
        this.activeScript = scr;
        switch(this.activeScript){
            case "headbutt": {
                this.owner.bringToFront(0);
                this.animObjects.push(new BasicAnim(this.scene,0,48,"booster",2,50,1,true,0,0,[0.5,0]));
                this.add(this.animObjects[0]);
                this.curSt = 0;
                this.stVars = [0];
                this.inAttackSequence = true;
                this.scene.sound.play("takeoff", {volume:0.25});
                break;
            } case "laser_eyes": {
                this.animObjects.push(new BasicAnim(this.scene,-40,-10,"laser_eye",4,50,1,true,0,0,[0.5,0.5]));
                this.add(this.animObjects[0]);
                this.curSt = 0;
                this.stVars = [250];
                this.inAttackSequence = true;
                break;
            } case "scan": {
                this.myGraphics.clear();
                this.myGraphics.setVisible(true);
                this.stVars = [500];
                this.curSt = 0;
                this.inAttackSequence = true;
                this.scene.sound.play("sonar", {volume: 0.35});
                break;
            } default: {
                break;
            }
        }
    }

    processScript(t: number, d: number){
        if(!this.inAttackSequence) {
            //console.log("Not in attack sequence");
            return;
        }
        switch(this.activeScript){
            case "headbutt": {
                this.processHeadbutt(t,d);
                break;
            } case "laser_eyes": {
                this.processLasers(t,d);
                break;
            } case "scan": {
                this.processScan(t,d);
                break;
            } default: {
                break;
            }
        }
    }

    processLasers(t: number, d: number){
        switch(this.curSt){
            case 0: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
                    this.stVars = [250];
                    this.curSt = 1;
                    this.lockProgress = 1;
                    let t = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1]-10)),(this.scene.getTargetX()-(this.owner.x+this.initPos[0]-48)));
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]-48),(this.owner.y+this.initPos[1]-10),
                    this,"laser",2,150,"laser",{
                        vx: Math.cos(t)*2400,
                        vy: Math.sin(t)*2400,
                        rotation: t*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetX(),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.75,0.5],     
                    }));
                    this.scene.sound.play("burstlaser", {volume: 0.25});
                }
                break;
            } case 1: {
                if(this.stVars[0] > 0)
                {
                    this.stVars[0] -= d;
                    if(this.stVars[0] <= 0){
                        this.stVars[0] = 0;
                        this.clearAnims();
                    }
                    if(this.animObjects.length > 0){
                        this.animObjects[0].setAlpha(this.stVars[0]/250);
                    }

                } else if(this.lockProgress == 0) {
                    this.curSt = 2;
                    this.stVars = [700];
                }
                break;
            } case 2: {
                if(this.stVars[0] > 0) {
                    this.stVars[0] -= d;
                    if(this.stVars[0] <= 0) {
                        this.owner.reorderParts();
                        this.curSt = 0;
                        this.stVars = [];
                        this.activeScript = "";
                        this.inAttackSequence = false;
                    }
                }
            } default: {
                break;
            }
        }
    }

    processScan(t: number, d: number){
        switch(this.curSt){
            case 0: {
                this.stVars[0] -=d;
                if(this.stVars[0] <= 0){
                    this.myGraphics.clear();
                    this.stVars = [250];
                    this.curSt = 1;
                } else {

                    /*
                    this.myGraphics.clear();
                    this.myGraphics.fillStyle(0xa6fff3, 0.9);
                    this.myGraphics.slice(0,0,750,Phaser.Math.DegToRad(135), Phaser.Math.DegToRad(225),false,0);
                    this.myGraphics.fillPath();*/
                    if(this.direction == -1) {
                        this.myGraphics.clear();
                        this.myGraphics.fillStyle(0xa6fff3, (this.stVars[0]/500));
                        this.myGraphics.slice(0,0,750,Phaser.Math.DegToRad(180-(45*(1-(this.stVars[0]/500)))),Phaser.Math.DegToRad(180+(45*(1-(this.stVars[0]/500)))),false,0);
                        this.myGraphics.fillPath();
                    } else if(this.direction == 1){
                        this.myGraphics.clear();
                        this.myGraphics.fillStyle(0xa6fff3, this.stVars[0]/500);
                        this.myGraphics.slice(0,0,750,Phaser.Math.DegToRad(0-(45*(1-(this.stVars[0]/500)))),Phaser.Math.DegToRad(0+(45*(1-(this.stVars[0]/500)))),false,0);
                        this.myGraphics.fillPath();
                    }
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 2;
                    this.scene.sound.play("sonar", {volume: 0.35});
                    this.stVars = [500];
                    this.myGraphics.clear();
                }
                break;
            } case 2: {
                this.stVars[0] -=d;
                if(this.stVars[0] <= 0){
                    this.myGraphics.clear();
                    this.stVars = [125];
                    this.curSt = 3;
                } else {
                    if(this.direction == -1) {
                        this.myGraphics.clear();
                        this.myGraphics.fillStyle(0xa6fff3, (this.stVars[0]/500));
                        this.myGraphics.slice(0,0,750,Phaser.Math.DegToRad(180-(45*(1-(this.stVars[0]/500)))),Phaser.Math.DegToRad(180+(45*(1-(this.stVars[0]/500)))),false,0);
                        this.myGraphics.fillPath();
                    } else if(this.direction == 1){
                        this.myGraphics.clear();
                        this.myGraphics.fillStyle(0xa6fff3, this.stVars[0]/500);
                        this.myGraphics.slice(0,0,750,Phaser.Math.DegToRad(0-(45*(1-(this.stVars[0]/500)))),Phaser.Math.DegToRad(0+(45*(1-(this.stVars[0]/500)))),false,0);
                        this.myGraphics.fillPath();
                    }
                } 
                break;
            } case 3: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.myGraphics.clear();
                    this.curSt = 0;
                    this.stVars = [];
                    this.activeScript = "";
                    this.inAttackSequence = false;
                }
                break;
            } default: {

            }
        }
    }

    inform(tag: string){
        switch(tag){
            case "laser": {
                this.lockProgress = 0;
                break;
            } default: {
                break;
            }
        }
    }



    processHeadbutt(t: number, d: number){
        switch(this.curSt){
            case 0: {
                this.y -= 900*(d/1000);
                if((this.y+this.owner.y) < -2000){
                    this.curSt = 1;
                    this.setAngle(-180);
                    this.x = this.owner.getEnemyX()-this.owner.x;
                }
                break;
            } case 1: {
                this.y += 3200*(d/1000);
                if((this.y+this.owner.y) > (this.owner.getEnemyY()-160)){
                    this.scene.sound.play("pan", {volume: 0.1});
                    this.stVars=[this.x-this.initPos[0],this.y-this.initPos[1],1,1];
                    this.curSt = 2;
                }
                break;
            } case 2: {
                this.stVars[2] -= 2*(d/1000);
                this.stVars[3] -= 2*(d/1000);
                if(this.stVars[2] <= 0 || this.stVars[3] <= 0){
                    this.curSt = 3;
                }
                this.setAngle(Math.random()*360);
                this.x = this.initPos[0]+(this.stVars[0]*this.stVars[2]);
                this.y = this.initPos[1]+(this.stVars[1]*this.stVars[3]);
                break;
            } case 3: {
                this.setAngle(0);
                this.clearAnims();
                this.x=this.initPos[0];
                this.y=this.initPos[1];
                this.owner.reorderParts();
                this.curSt = 0;
                this.stVars = [];
                this.activeScript = "";
                this.inAttackSequence = false;
            } default: {
                break;
            }
        }
    }
}