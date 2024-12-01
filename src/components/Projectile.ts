import { GameScene } from "@/scenes/GameScene";
import { BasicAnim } from "./BasicAnim";
import { RobotSeg } from "./RobotSeg";

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

export class Projectile extends Phaser.GameObjects.Container{
    public spr: BasicAnim;
    public owner: RobotSeg;
    public scaleTime: number;
    public ID: string;
    public deleteFlag: boolean = false;
    public scene: GameScene;
    protected curScale: number = 0.05;
    protected scaleTimer: number = 1000;
    protected hitFlag: boolean = false;
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
    constructor(scene: GameScene, x: number, y: number, owner: RobotSeg, spr: string, nframes: number, scaleTime: number, ID: string, pdata: ProjectileData, acc: number = 1){
        super(scene,x,y);
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
        if(this.pD.spin != 0){
            this.spr.setAngle(this.spr.angle+(this.pD.spin*(d/1000)));
        }
        this.spr.tick(t, d);
        this.x += this.pD.vx*(d/1000);
        this.y += this.pD.vy*(d/1000);
        switch(this.pD.direction){
            case 1: {
                if(this.x > this.pD.endx) {
                    this.owner.inform(this.ID);
                    this.scene.informHitByPart(this.ID, this.pD.target);
                    this.deleteFlag = true;
                    break;
                }
            } case -1: {
                if(this.x < this.pD.endx) {
                    this.owner.inform(this.ID);
                    this.scene.informHitByPart(this.ID, this.pD.target);
                    this.deleteFlag = true;
                    break;
                }
            } default: {
                break;
            }
        }
    }
}