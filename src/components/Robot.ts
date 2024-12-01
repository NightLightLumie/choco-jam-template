import { BaseScene } from "@/scenes/BaseScene";
import { Legs } from "./Legs";
import { Arms } from "./Arms";
import { Head } from "./Head";
import { Torso } from "./Torso";
import { GameScene } from "@/scenes/GameScene";
import { BasicAnim } from "./BasicAnim";
import { AbilityOption } from "./Data/GlobalVariables";

export class Robot extends Phaser.GameObjects.Container{

    public mTarget = 3;
    
    public myLegs: Legs;
    public backLegs: Legs;
    public myHead: Head;
    public myArms: Arms;
    public backArms: Arms;
    public myTorso: Torso;

    private amp: number = 8;

    private spazTimer: number = 50;
    public scene: GameScene;
    public direction: number;

    public speed: number = 10;
    public dynamic: boolean = false;
    public dead: boolean = false;

    public scripts: AbilityOption[];


    public queuedPart: number = 0;
    public queuedAction: string = "idle";

    constructor(scene: GameScene, x: number, y: number, direction: number){
        super(scene,x,y);
        this.scene = scene;

        this.myHead = new Head(scene,0,-196,"rhead", this, direction);
        this.backLegs = new Legs(scene,-80,80,"rleg", this, direction);
        this.myLegs = new Legs(scene,80,80,"rleg", this, direction);
        this.backArms = new Arms(scene,-110,-110,"rarm", this, direction);
        this.myTorso = new Torso(scene,0,0,"rbody", this, direction);
        this.myArms = new Arms(scene,110,-110,"rarm", this, direction);

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

    queueAction(p: number, s: string){
        this.queuedPart = p;
        this.queuedAction = s;
    }

    executeAction(){
        this.dynamic = true;
        switch(this.queuedPart){
            case 0: {
                if(this.myHead.alive){
                    this.myHead.setScript(this.queuedAction);
                } else {
                    this.myHead.setScript("idle");
                }
                break;
            } case 1: {
                if(this.myTorso.alive){
                    this.myTorso.setScript(this.queuedAction);
                } else {
                    this.myTorso.setScript("idle");
                }
                break;
            } case 2: {
                if(this.myArms.alive){
                    this.myArms.setScript(this.queuedAction);
                } else {
                    this.myArms.setScript("idle");
                }
                break;
            } case 3: {
                if(this.myLegs.alive){
                    this.myLegs.setScript(this.queuedAction);
                } else {
                    this.myLegs.setScript("idle");
                }
                break;
            }
        }
    }

    tick(t: number, d: number){
        if(this.dead){
            this.dtick(t, d);
            return;
        }

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

    dtick(t: number, d: number){

    }

    advancePart(){
        this.mTarget++;
        if(this.mTarget > 3) {
            this.mTarget = 0;
        }
    }

    testAttack(n: number, st: string){
        switch(n){
            case 0: {
                this.myHead.setScript(st);
                break;
            } case 1: {
                this.myTorso.setScript(st);
                break;
            } case 2: {
                this.myArms.setScript(st);
                break;
            } case 3: {
                this.myLegs.setScript(st);
                break;
            } default: {
                break;
            }
        }
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
                return (this.y+this.myArms.y+64);
                break;
            } case 3: {
                return (this.y+this.myLegs.y+64);
                break;
            } default: {
                return this.y;
                break;
            }
        }
    }

    getPartX(n: number){
        switch(n){
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

    getPartY(n: number){
        switch(n){
            case 0: {
                return (this.y+this.myHead.y);
                break;
            } case 1: {
                return (this.y+this.myTorso.y);
                break;
            } case 2: {
                return (this.y+this.myArms.y+64);
                break;
            } case 3: {
                return (this.y+this.myLegs.y+64);
                break;
            } default: {
                return this.y;
                break;
            }
        }
    }

    getRandomPartID(){
        //return 1;
        return(Math.trunc(Math.random()*3.99999));
    }

    getCurrentPartID(): number{
        return this.mTarget;
    }

    takeHit(s: string){
        switch(s) {
            case "laser": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } case "fireball": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"bad_fire",6,100,0.8,false,0,0,[0.5,0.75]));
                this.scene.sound.play("bigfire",{volume: 1});
                break;
            } case "saw" : {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"explosion_tiny",6,100,0.8,false,0,0,[0.5,0.75]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } case "katana": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } case "turret": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"hit_spark",3,60,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("hit",{volume: 0.5});
                break;
            } case "pan": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX(), this.getTargetY(),"hit_spark",3,60,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("pan",{volume: 0.15});
                break;
            } case "bees": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getTargetX()-30+(Math.random()*30), this.getTargetY()-30+(Math.random()*30),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            }
             default: {
                break;
            }
        }
    }

    takeHitByPart(s: string, n: number){
        switch(s) {
            case "laser": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n), this.getPartY(n),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } case "fireball": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n), this.getPartY(n),"bad_fire",6,100,0.8,false,0,0,[0.5,0.75]));
                this.scene.sound.play("bigfire",{volume: 1});
                break;
            } case "saw" : {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n), this.getPartY(n),"explosion_tiny",6,100,0.8,false,0,0,[0.5,0.75]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } case "katana": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n), this.getPartY(n),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            } case "turret": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n), this.getPartY(n),"hit_spark",3,50,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("hit",{volume: 0.5});
                break;
            } case "pan": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n), this.getPartY(n),"hit_spark",3,50,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("pan",{volume: 0.15});
                break;
            } case "bees": {
                this.scene.addEffect(new BasicAnim(this.scene,this.getPartX(n)-30+(Math.random()*30), this.getPartY(n)-30+(Math.random()*30),"explosion_red",25,25,0.8,false,0,Math.random()*360,[0.5,0.5]));
                this.scene.sound.play("laserboom",{volume: 0.2});
                break;
            }
             default: {
                break;
            }
        }
    }
}