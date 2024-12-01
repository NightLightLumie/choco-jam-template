import { BaseScene } from "@/scenes/BaseScene";
import { BasicAnim } from "./BasicAnim";
import { BasicEffect } from "./BasicEffect";

export class FadeAnim extends BasicAnim{

    protected fdTime: number = 1000;
    protected fdTimer: number = 0;
    protected holdTime: number = 0;
    public holdLastFrame: boolean = false;
    constructor(scene: BaseScene, x: number, y: number, spr: string, nFrames: number, frameLen: number, alpha: number, loop: boolean = true, sFrame: number = 0, rotation: number = 0, origin: number[] = [0.5,0.5], scale: number[] = [1,1], fdTime: number = 1000, holdTime: number = 1000){
        super(scene,x,y,spr,nFrames,frameLen,alpha,loop,sFrame,rotation,origin);
        this.holdLastFrame = false;
        this.loop = true;
        this.sprite.setScale(scale[0],scale[1]);
        this.fdTime = fdTime;
        this.fdTimer = fdTime;
        this.holdTime = holdTime;
    }

    tick(t: number, d: number){
        super.tick(t,d);
        if(this.holdTime > 0){
            this.holdTime -= d;
        } else {
            this.fdTimer -= d;
            if(this.fdTimer <= 0) {
                this.deleteFlag = true;
                this.setAlpha(0);
                this.setVisible(false);
            } else {
                this.setAlpha(this.fdTimer/this.fdTime);
            }
        }

    }
}