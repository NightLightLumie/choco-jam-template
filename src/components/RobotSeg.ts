import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { BasicAnim } from "./BasicAnim";
import { Robot } from "./Robot";
import { Familiar } from "./Familiar";

export interface PartAttribute{
    damage: number;
    health: number;
    speed: number;
    tags: string[];
}

export class RobotSeg extends Phaser.GameObjects.Container{ //base class for robot parts
    public animObjects: BasicAnim[] = [];
    public familiars: Familiar[] = [];
    public inAttackSequence: boolean = false;
    public initPos: number[];
    public owner: Robot;
    public stunned: boolean = false;
    public alive: boolean = true;
    public hp: number = 10000;
    public maxhp: number = 10000;
    public atk: number = 100;

    //attack script variables
    public lockProgress: number = 0;
    public stVars: number[] = [];
    public curSt: number = -1;
    public activeScript: string = "";
    public myGraphics: Phaser.GameObjects.Graphics;
    public direction: number = -1;
    public myPartID: number;

    public scene: GameScene
    constructor(scene: GameScene, x: number, y: number, owner: Robot, direction: number){
        super(scene,x,y);
        this.scene = scene;
        this.owner = owner;
        this.initPos = [x,y];
        this.myGraphics = this.scene.add.graphics();
        this.direction = direction;
        this.add(this.myGraphics);
    }

    clearAnims(){
		for(let er = this.animObjects.length-1; er >= 0; er--) {
			this.animObjects[er].deleteFlag = true;
            this.animObjects[er].destroy();
		}
        this.animObjects = [];
    }

    clearFamiliars(){
		for(let ef = this.familiars.length-1; ef >= 0; ef--) {
			this.familiars[ef].deleteFlag = true;
            this.familiars[ef].destroy();
		}
        this.familiars = [];
    }

    spaz(){
        if(!this.inAttackSequence) {
            this.x = this.initPos[0] + Math.random()*8;
            this.y = this.initPos[1] + Math.random()*8;
            return;
        }
    }

    tick(t: number, d: number){
        if(this.animObjects.length > 0){
            for(let er = this.animObjects.length-1; er >= 0; er--) {
                this.animObjects[er].tick(t,d);
                if (this.animObjects[er].deleteFlag){
                    this.animObjects[er].destroy();
                    this.animObjects.splice(er,1);
                }

            }
        }

        if(this.familiars.length > 0){
            for(let ef = this.familiars.length-1; ef >= 0; ef--) {
                this.familiars[ef].tick(t,d);
                if (this.familiars[ef].deleteFlag){
                    this.familiars[ef].destroy();
                    this.familiars.splice(ef,1);
                }

            }
        }

        if(this.hp <= 0) {
            this.alive = false;
            return;
        }
    }

    dtick(t: number, d: number){

    }

    takeDmg(n: number){
        this.hp -= n;
        if(this.hp <= 0){
            this.alive = false;
            this.setAlpha(0.7);
        }
    }

    takeHit(tag: string){
        switch(tag){
            case "headbutt": {
                break;
            } case "laser": {
                break;
            } default: {
                break;
            }
        }
    }

    inform(tag: string){

    }

    takeDamage(dmg: number, tag: string){

    }

    attack(){

    }

    queueFinished(){

    }
}