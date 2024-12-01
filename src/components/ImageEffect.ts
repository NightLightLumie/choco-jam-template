import { BasicEffect } from "./BasicEffect";
import { BaseScene } from "@/scenes/BaseScene";
export class ImageEffect extends BasicEffect {
    constructor(scene: BaseScene, x: number, y: number){
        super(scene,x,y);
    }

    tick(t: number, d: number){

    }
}