import { GameScene } from "@/scenes/GameScene";
import { BasicAnim } from "./BasicAnim";
import { RobotSeg } from "./RobotSeg";
import { Projectile } from "./Projectile";

export class ProjectileData {
    vx: number;
    vy: number;
    rotation: number;
    direction: number;
    endx: number;
    spin: number;
    wait: number;
    ax: number;
    ay: number;
    origin: number[];
    target: number[];

}

export class Pan extends Projectile{
    public spr: BasicAnim;
    public owner: RobotSeg;
    public scaleTime: number;
    public ID: string;
    public deleteFlag: boolean = false;
    public scene: GameScene;
    private isMiss: boolean = false;
    private isCrit: boolean = false;

    private rspd: number = 0;
    private fading: boolean = false;
    private fadeTime: number = 500;
    private offset: number = 0;

    public pD: ProjectileData = {
        vx: 0,
        vy: 0,
        rotation: 0,
        direction: 0,
        endx: 0,
        spin: 0,
        wait: 0,
        ax: 0,
        ay: 0,
        origin: [0.5,0.5], 
        target: [-1,0],       
    }
    constructor(scene: GameScene, x: number, y: number, owner: RobotSeg, spr: string, nframes: number, scaleTime: number, ID: string, pdata: ProjectileData, miss: number = 1, crit: number = 0){
        super(scene,x,y,owner,spr,nframes,scaleTime,ID,pdata);
        this.scene = scene;
        this.owner = owner;
        this.ID = ID;
        this.spr = new BasicAnim(scene,0,0,spr,nframes,50,1,true,0,0,pdata.origin);
        this.add(this.spr);
        this.scene.add.existing(this);
        this.scaleTime = scaleTime;
        this.scaleTimer = this.scaleTime;
        this.spr.setScale(0.05,1);
        this.cloneData(pdata);
        this.setAngle(this.pD.rotation);

        this.rspd = -720+Math.round((Math.random()*1440));
        if(Math.random() < miss){
            this.isMiss = true;
        }

        if(this.isMiss) {
            this.pD.vy *= (-1.5+(Math.random()*3));
        }
        if(Math.random() < crit){
            this.isCrit = true;
        }
        //console.log("X TARGET: " + pdata.endx);
        //console.log("OBJ TARGET: " + pdata.target);
    }

    cloneData(p: ProjectileData){
        this.pD.vx = p.vx;
        this.pD.vy = p.vy;
        this.pD.rotation = p.rotation;
        this.pD.direction = p.direction;
        this.pD.endx = p.endx;
        this.pD.spin = p.spin;
        this.pD.wait = p.wait;
        this.pD.ax = p.ax;
        this.pD.ay = p.ay;
        this.pD.origin = p.origin;
        this.pD.target = p.target;
    }

    boundCheck(){

    }

    calcAccel(t:number,d:number){
        if(this.pD.ax != 0){
            this.pD.vx += this.pD.ax*(d/1000);
        }
        if(this.pD.ay != 0){
            this.pD.vy += this.pD.ay*(d/1000);
        }
    }

    tick(t: number, d: number){
        if(this.scaleTimer > 0) {
            this.scaleTimer -= d;
            if(this.scaleTimer <= 0) {
                this.curScale = 1;
            } else {
                this.curScale = 0.05 + (0.95*(1-(this.scaleTimer/this.scaleTime)));
            }
            this.spr.setScale(this.curScale,1);
        }
        this.spr.setAngle(this.spr.angle+(this.rspd*(d/1000)));

        //this.spr.tick(t, d);
        this.calcAccel(t,d);
        this.x += this.pD.vx*(d/1000);
        this.y += this.pD.vy*(d/1000);

        if(this.fading) {
            this.fadeTime -= d;
            if(this.fadeTime <= 0){
                this.setAlpha(0);
                this.deleteFlag = true;
                this.owner.inform(this.ID);
            } else {
                this.setAlpha(this.fadeTime/500);
            }            
        }

        if(this.hitFlag != true){
            switch(this.pD.direction){
                case 1: {
                    if(this.x > this.pD.endx) {
                        if(this.isMiss){
                            this.hitFlag = true;
                            this.fading = true;
                            break;
                        } else {

                            this.scene.informHitByPart(this.ID, this.pD.target);
                            this.spr.setFrame(1);
                            this.rspd = 0;
                            this.pD.vx *= (-1*(0.75+Math.random()*0.5));
                            this.pD.vy *= (0.75+Math.random()*0.5);
                            this.pD.ay = 5000;
                            this.hitFlag = true;
                            this.fading = true;
                            if(this.isCrit) {
                                this.scene.sound.play("crit", {volume:0.35});
                            }
                        }
                    }
                    break;
                } case -1: {
                    if(this.x < this.pD.endx) {
                        if(this.isMiss){
                            this.hitFlag = true;
                            this.fading = true;
                            break;
                        } else {
                            this.scene.informHitByPart(this.ID, this.pD.target);
                            this.spr.setFrame(1);
                            this.rspd = 0;
                            this.pD.vx *= (-1*(0.75+Math.random()*0.5));
                            this.pD.vy *= (0.75+Math.random()*0.5);
                            this.pD.ay = 5000;
                            this.hitFlag = true;
                            this.fading = true;
                            console.log("CRIT: " + this.isCrit);
                            if(this.isCrit) {
                                this.scene.sound.play("crit", {volume:0.75});
                            }
                        }
                    }
                    break;
                } default: {
                    break;
                }
            }
        }
    }
}