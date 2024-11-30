import { BaseScene } from "@/scenes/BaseScene";

export class BasicEffect extends Phaser.GameObjects.Container{
    public deleteFlag: boolean = false;
    constructor(scene: BaseScene, x: number, y: number){
        super(scene,x,y);
    }

    tick(t: number, d: number){

    }

    

}