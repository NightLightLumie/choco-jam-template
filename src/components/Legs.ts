import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { RobotSeg } from "./RobotSeg";
import { Robot } from "./Robot";
import { BasicAnim } from "./BasicAnim";
import { Projectile } from "./Projectile";
import { ProjectileData } from "./Projectile";
import { FadeAnim } from "./FadeAnim";

export class Legs extends RobotSeg{
    public frontLeg: Phaser.GameObjects.Image;
    private superSpin: boolean = false;
    public initAngle = 0;
    private rotationSpeed: number = 360;
    private rotationTarget: number = 0;
    private finishedRotation = true;
    private rotationTracker: number = 0;
    private statRotAdj: number = 90;
    private statRotSpeed: number = 0;

    constructor(scene: GameScene, x: number, y: number, spr: string, owner: Robot, direction: number){
        super(scene,x,y,owner, direction);
        this.frontLeg = new Phaser.GameObjects.Image(scene,0,0,spr);
        this.frontLeg.setOrigin(0.5,0);
        this.add(this.frontLeg);
        this.myPartID = 3;
    }

    tick(t: number, d: number){
        super.tick(t,d);
        this.processScript(t,d);
        this.processRotation(t,d);

    }

    processRotation(t: number, d: number){
        if(this.superSpin) {
            this.setAngle(-180+(Math.random()*360));
        }
        if(this.statRotSpeed != 0){
            this.setAngle(this.angle + this.statRotSpeed*(d/1000));
        }
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

    processBees(t: number, d: number){
        switch(this.curSt){
            case 0: {
                if(this.finishedRotation){
                    this.curSt = 1;
                    this.stVars = [250];
                    this.rotationTarget = 0;
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0){
                    this.curSt = 2;
                    let td = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                    this.scene.addEffect(new FadeAnim(this.scene, this.owner.x+this.initPos[0]+128*Math.cos(td),this.owner.y+this.initPos[1]+128*Math.sin(td),
                    "beelaser",3,75,1,true,0,Phaser.Math.RadToDeg(td),[0,0.5],[2,1.5],500,1000));
                    this.scene.sound.play("bees",{volume:0.5});
                    this.stVars = [1500, 300, 600, 900];

                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                if(this.stVars[1] > 0){
                    this.stVars[1] -= d;
                    if(this.stVars[1] <= 0){
                        this.scene.informHitByPart("bees",[this.direction,this.scene.getActivePartID()]);
                    }
                }
                if(this.stVars[2] > 0){
                    this.stVars[2] -= d;
                    if(this.stVars[2] <= 0){
                        this.scene.informHitByPart("bees",[this.direction,this.scene.getActivePartID()]);
                    }
                }
                if(this.stVars[3] > 0){
                    this.stVars[3] -= d;
                    if(this.stVars[3] <= 0){
                        this.scene.informHitByPart("bees",[this.direction,this.scene.getActivePartID()]);
                    }
                }
                if(this.stVars[0] <= 0) {
                    this.curSt = 3;
                    this.stVars = [];
                    this.rotationSpeed = 360;
                    this.rotationTarget = 0;
                    this.finishedRotation = false;
                }
                break;
            } case 3: {
                if(this.finishedRotation) {
                    this.curSt = 4;
                    this.stVars = [125]
                    this.rotationSpeed = 0;
                    this.rotationTarget = 0;
                    this.finishedRotation = true;
                }
                break;
            } case 4: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
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

    processKatanaBoots(t: number, d: number){
        switch(this.curSt){
            case 0: {
                this.stVars[0] -=d ;
                this.statRotSpeed += (2880*d/1000);
                if(this.stVars[0] <= 0) {
                    this.angle = 0;
                    this.superSpin = true;
                    this.statRotSpeed = 0;
                    this.curSt = 1;
                    this.stVars = [300];
                }
                break;
            } case 1: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
                    this.curSt = 2;
                    this.stVars = [500,100,200,300,0];
                    this.lockProgress = 3;
                }
                break;
            } case 2: {
                this.stVars[0] -= d;
                this.stVars[1] -= d;
                this.stVars[2] -= d;
                this.stVars[3] -= d;

                if(this.stVars[0] <= 0) {
                    if(this.lockProgress <= 0) {
                        this.curSt = 3;
                        this.superSpin = false;
                        this.stVars = [565];
                        this.lockProgress = 0;
                        this.setAngle(0);
                        this.statRotSpeed = 1440;
                    }
                }

                if((this.stVars[1] <= 0) && (this.stVars[4]<1)) {
                    this.stVars[4] += 1;
                    let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]),(this.owner.y+this.initPos[1]),
                    this,"katana",2,350,"katana",{
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
                        target: [this.direction, this.scene.getActivePartID()],     
                    }));
                    this.scene.sound.play("katana", {volume: 0.35});
                }
                if((this.stVars[2] <= 0) && (this.stVars[4]<2)) {
                    this.stVars[4] += 1;
                    let ppa = this.scene.getTargetedBot().getRandomPartID();
                    let tr = Math.atan2((this.scene.getTargetedBot().getPartY(ppa)-(this.owner.y+this.initPos[1])),(this.scene.getTargetedBot().getPartX(ppa)-(this.owner.x+this.initPos[0])));
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]),(this.owner.y+this.initPos[1]),
                    this,"katana",2,350,"katana",{
                        vx: Math.cos(tr)*1600,
                        vy: Math.sin(tr)*1600,
                        rotation: tr*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetedBot().getPartX(ppa),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.75,0.5],
                        target: [this.direction, ppa],     
                    }));
                    this.scene.sound.play("katana", {volume: 0.35});
                }
                if((this.stVars[3] <= 0) && (this.stVars[4]<3)) {
                    this.stVars[4] += 1;
                    let ppb = this.scene.getTargetedBot().getRandomPartID();
                    let ts = Math.atan2((this.scene.getTargetedBot().getPartY(ppb)-(this.owner.y+this.initPos[1])),(this.scene.getTargetedBot().getPartX(ppb)-(this.owner.x+this.initPos[0])));
                    this.scene.addProjectile(new Projectile(this.scene,(this.owner.x+this.initPos[0]),(this.owner.y+this.initPos[1]),
                    this,"katana",2,350,"katana",{
                        vx: Math.cos(ts)*1600,
                        vy: Math.sin(ts)*1600,
                        rotation: ts*(180/Math.PI),
                        direction: -1,
                        endx: this.scene.getTargetedBot().getPartX(ppb),
                        spin: 0,
                        wait: 0,
                        ax: 0,
                        ay: 0,
                        origin: [0.75,0.5],
                        target: [this.direction, ppb],     
                    }));
                    this.scene.sound.play("katana", {volume: 0.35});
                }
                break;
            } case 3: {
                this.stVars[0] -= d;
                if(this.stVars[0] <= 0) {
                    this.curSt = 4;
                    this.stVars = [];
                    this.finishedRotation = false;
                    this.statRotSpeed = 0;
                    this.rotationSpeed = 720;
                    this.rotationTarget = 0;
                }
                break;
            } case 4: {
                if(this.finishedRotation){
                    this.curSt = 0;
                    this.stVars = [];
                    this.finishedRotation = true;
                    this.statRotSpeed = 0;
                    this.superSpin = false;
                    this.rotationTarget = 0;
                    this.lockProgress = 0;
                    this.setAngle(0);
                    this.inAttackSequence = false;
                }
                break;
            } default: {
                break;
            }
        }
    }

    setScript(scr: string){
        this.activeScript = scr;
        switch(this.activeScript){
            case "saw": {
                this.owner.bringToFront(this.myPartID);
                this.curSt = 0;
                this.stVars = [500];
                this.animObjects.push(new BasicAnim(this.scene,0,0,"door",5,100,1,false,0,0,[0.5,0.5]));
                this.animObjects[0].holdLastFrame = true;
                this.add(this.animObjects[0]);
                this.inAttackSequence = true;
                break;
            } case "katanaboots": {
                this.curSt = 0;
                this.stVars = [500];
                this.finishedRotation = true;
                this.statRotSpeed = 360;
                this.inAttackSequence = true;
                break;
            } case "bees": {
                //this.owner.bringToFront(this.myPartID);
                this.curSt = 0;
                this.stVars = [0];
                this.inAttackSequence = true;
                let tx = Math.atan2((this.scene.getTargetY()-(this.owner.y+this.initPos[1])),(this.scene.getTargetX()-(this.owner.x+this.initPos[0])));
                this.rotationSpeed = 360;
                this.rotationTarget = this.normalizeAngle(Phaser.Math.RadToDeg(tx)+(this.direction*this.statRotAdj));
                this.finishedRotation = false;
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
            case "katanaboots": {
                this.processKatanaBoots(t,d);
                break;
            } case "bees": {
                this.processBees(t,d);
                break;
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
            case "katana": {
                this.lockProgress -= 1;
                break;
            } default: {
                break;
            }
        }
    }
}