import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";

export class GravityParticle extends BasicEffect{
    constructor(scene:GameScene,x:number,y:number, spr: string, scale: number[], vrad: number, g: number, spin: number, time: number){
        super(scene,x,y);
    }
}