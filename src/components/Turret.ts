import { GameScene } from "@/scenes/GameScene";
import { Familiar } from "./Familiar";
import { RobotSeg } from "./RobotSeg";
import { BasicAnim } from "./BasicAnim";
import { Projectile } from "./Projectile";
import { ProjectileData } from "./Projectile";

export class Turret extends Familiar{
    public target: number[];

    public tbase: Phaser.GameObjects.Sprite;
    public tgun: Phaser.GameObjects.Sprite;
    private amt: number;
    private initAmt: number;
    public stateTracker: number;
    public scene: GameScene;
    private tpos: number;
    private tng: number;

    private phase: number = 0;
    private timer: number = 500;
    private tag: string = "";

    private rspeed: number = 360;
    private finishedRotation: boolean = false;

    constructor(scene:GameScene,x:number,y:number,owner:RobotSeg,dir:number, target: number[], tag: string = "turret"){
        super(scene,x,y,owner,dir);
        this.scene=scene;
        this.target = target;
        this.amt = 3+Math.trunc(Math.random()*3.999);
        this.initAmt = this.amt;
        this.stateTracker = this.amt+1;
        this.tbase = new Phaser.GameObjects.Sprite(this.scene,0,0,"tbase");
        this.tbase.setOrigin(0.5,0.5);
        this.tgun = new Phaser.GameObjects.Sprite(this.scene,0,0,"tgun");
        this.tgun.setOrigin(0.5,0.5);

        this.tbase.setScale(1,1);
        this.tgun.setScale(1,dir);

        this.add(this.tbase);
        this.add(this.tgun);
        this.scene.add.existing(this);

        this.tng = Math.atan2((this.scene.getTargetY()-this.y),(this.scene.getTargetX()-this.x));
        this.tpos = Phaser.Math.RadToDeg(this.tng);


        this.setAlpha(0);

    }

    tick(t: number, d: number){
        super.tick(t,d);
        switch(this.phase){
            case 0: {
                this.timer -= d;
                if(this.timer <= 0){
                    this.setAlpha(1);
                    this.timer = 0;
                    this.phase = 1;
                    this.finishedRotation = false;
                } else {
                    this.setAlpha((1-(this.timer/1000)));
                }
                break;
            } case 1: {
                if(this.finishedRotation){
                    this.tgun.setAngle(this.tpos);
                    this.shoot();
                    this.amt--;
                    this.timer = 250;
                    this.phase = 2;
                }
                break;
            } case 2: {
                this.timer -= d;
                if(this.timer <= 0) {
                    if(this.amt > 0){
                        this.shoot();
                        this.amt--;
                        this.timer = 250;
                    } else {
                        this.phase = 3;
                        this.timer = 500;
                    }
                }
                break;
            } case 3: {
                this.timer -= d;
                if(this.timer <= 0){
                    this.setAlpha(0);
                    this.deleteFlag = true;
                    this.owner.inform("turret");
                    this.phase = 99;
                    this.timer = -1;
                } else {
                    this.setAlpha(this.timer/500);
                }
                break;
            } default: {
                break;
            }
        }

        this.processRotation(t,d);
    }

    shoot(){
        this.scene.addEffect(new BasicAnim(this.scene,this.x+128*Math.cos(this.tng), this.y+Math.sin(this.tng),"flash",2,25,0.75,false,0,this.tpos,[0.5,0.5]));
        this.scene.addProjectile(new Projectile(this.scene,this.x+(128*Math.cos(this.tng)),
        this.y+(128*Math.sin(this.tng)),
        this.owner,"sbullet",1,250,"turret",{
            vx: Math.cos(this.tng)*1600,
            vy: Math.sin(this.tng)*1600,
            rotation: this.tpos,
            direction: -1,
            endx: this.scene.getTargetX(),
            spin: 0,
            wait: 0,
            ax: 0,
            ay: 0,
            origin: [0.5,0.5],
            target: [this.direction,this.scene.getActivePartID()],     
        }));

        this.scene.sound.play("gun", {volume: 0.25});
    }

    processRotation(t: number, d: number){
        if(this.finishedRotation) {
            return;
        } else {
            if(this.direction == -1) {
                this.tgun.setAngle(this.tgun.angle+this.direction*(this.rspeed*(d/1000)));
                //console.log("ANGLE: " + this.angle);
                if(this.tgun.angle >= this.tpos) {
                    this.tgun.setAngle(this.tpos);
                    this.finishedRotation = true;
                }
            } else if (this.direction == 1) {
                this.tgun.setAngle(this.tgun.angle-this.direction*(this.rspeed*(d/1000)));
                //console.log("ANGLE: " + this.angle);
                if(this.angle <= this.tpos) {
                    this.tgun.setAngle(this.tpos);
                    this.finishedRotation = true;
                }
            } else {
                this.finishedRotation = true;
            }
        }
    }


}