import { BaseScene } from "@/scenes/BaseScene";
import { Legs } from "./Legs";
import { Arms } from "./Arms";
import { Head } from "./Head";
import { Torso } from "./Torso";
import { GameScene } from "@/scenes/GameScene";
import { BasicAnim } from "./BasicAnim";

export class Robot extends Phaser.GameObjects.Container{

    public mTarget = 0;
    
    public myLegs: Legs;
    public backLegs: Legs;
    public myHead: Head;
    public myArms: Arms;
    public backArms: Arms;
    public myTorso: Torso;

    private amp: number = 8;

    private spazTimer: number = 50;
    public scene: GameScene;

    constructor(scene: GameScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;

        this.myHead = new Head(scene,0,-196,"rhead", this);
        this.backLegs = new Legs(scene,-80,80,"rleg", this);
        this.myLegs = new Legs(scene,80,80,"rleg", this);
        this.backArms = new Arms(scene,-110,-110,"rarm", this);
        this.myTorso = new Torso(scene,0,0,"rbody", this);
        this.myArms = new Arms(scene,110,-110,"rarm", this);

        this.add(this.myHead);
        this.add(this.backLegs);
        this.add(this.myLegs);
        this.add(this.backArms);
        this.add(this.myTorso);
        this.add(this.myArms);

        this.scene.add.existing(this);

    }

    reorderParts(){
        this.myArms.setDepth(10);
        this.myTorso.setDepth(9);
        this.backArms.setDepth(8);
        this.myLegs.setDepth(7);
        this.backLegs.setDepth(6);
        this.myHead.setDepth(5);
    }

    bringToFront(index: number){
        switch(index) {
            case 0: {
                this.myHead.setDepth(20);
                break;
            } case 1: {
                this.myTorso.setDepth(20);
                break;
            } case 2: {
                this.myArms.setDepth(20);
                break;
            } case 3: {
                this.myLegs.setDepth(20);
                break;
            }
        }
    }



    tick(t: number, d: number){

        this.spazTimer -= d;
        if(this.spazTimer <= 0){
            this.spazTimer = 50;
            this.myHead.spaz();
            this.backLegs.spaz();
            this.myLegs.spaz();
            this.backArms.spaz();
            this.myTorso.spaz();
            this.myArms.spaz();
        }

        this.myHead.tick(t,d);
        this.backLegs.tick(t,d);
        this.myLegs.tick(t,d);
        this.backArms.tick(t,d);
        this.myTorso.tick(t,d);
        this.myArms.tick(t,d);
    }

    advancePart(){
        this.mTarget++;
        if(this.mTarget > 3) {
            this.mTarget = 0;
        }
    }

    testAttack(st: string){
        this.myHead.setScript(st);
    }

    getEnemyX(){
        return this.scene.getTargetX();
    }

    getEnemyY(){
        return this.scene.getTargetY();
    }

    getTargetX(){
        switch(this.mTarget){
            case 0: {
                return (this.x+this.myHead.x);
                break;
            } case 1: {
                return (this.x+this.myTorso.x);
                break;
            } case 2: {
                return (this.x+this.myArms.x);
                break;
            } case 3: {
                return (this.x+this.myLegs.x);
                break;
            } default: {
                return this.x;
                break;
            }
        }
    }

    getTargetY(){
        switch(this.mTarget){
            case 0: {
                return (this.y+this.myHead.y);
                break;
            } case 1: {
                return (this.y+this.myTorso.y);
                break;
            } case 2: {
                return (this.y+this.myArms.y);
                break;
            } case 3: {
                return (this.y+this.myLegs.y);
                break;
            } default: {
                return this.y;
                break;
            }
        }
    }

    takeHit(s: string){
        switch(s) {
            case "laser": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } default: {
                break;
            }
        }
    }
}