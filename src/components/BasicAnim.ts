import { BaseScene } from "@/scenes/BaseScene";
import { BasicEffect } from "./BasicEffect";

export class BasicAnim extends BasicEffect{
    protected timer: number;
    protected flen: number;
    protected frames: number;
    protected curFrame: number = 0;
    protected sprite: Phaser.GameObjects.Sprite;
    protected loop: boolean = false;
    public holdLastFrame: boolean = false;
    constructor(scene: BaseScene, x: number, y: number, spr: string, nFrames: number, frameLen: number, alpha: number, loop: boolean = true, sFrame: number = 0, rotation: number = 0, origin: number[] = [0.5,0.5]){
        super(scene,x,y);
        this.sprite = new Phaser.GameObjects.Sprite(scene,0,0,spr);
        this.flen = frameLen;
        this.frames = nFrames;
        this.sprite.setFrame(sFrame);
        this.loop = loop;
        this.sprite.setOrigin(origin[0],origin[1]);
        this.sprite.setAngle(rotation);
        this.add(this.sprite);
        this.timer = this.flen;
    }

    setFrame(n: number){
        this.sprite.setFrame(n);
    }

    tick(t: number, d: number){
        this.timer -= d;
        if(this.timer <= 0){
            this.curFrame++;
            this.timer = this.flen;
            if(this.curFrame >= this.frames){
                if(this.loop){
                    this.curFrame = 0;
                } else {
                    this.curFrame = this.frames - 1;
                    if(!this.holdLastFrame){
                        this.deleteFlag = true;
                    }
                }
            }
            this.sprite.setFrame(this.curFrame);
        }
    }
}