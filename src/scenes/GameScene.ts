import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Robot } from "@/components/Robot";
import { BasicEffect } from "@/components/BasicEffect";
import { Projectile } from "@/components/Projectile";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private ui: UI;

	public rightRobot: Robot;
	public leftRobot: Robot;
	public currentTarget: number = -1;

	public effects: BasicEffect[];
	public effectContainer: Phaser.GameObjects.Container;

	public projs: Projectile[];
	public projContainer: Phaser.GameObjects.Container;

	public testTimer: number = 0;
	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.ui = new UI(this);

		this.initTouchControls();

		this.rightRobot = new Robot(this,1600,520);
		this.leftRobot = new Robot(this,320,520);

		this.effects = [];
		this.effectContainer = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.effectContainer);

		this.projs = [];
		this.projContainer = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.projContainer);

	}

	update(time: number, delta: number) {
		this.rightRobot.tick(time,delta);
		this.leftRobot.tick(time,delta);
		this.updateProjectiles(time, delta);
		this.updateEffects(time, delta);
		if(this.testTimer >= 0) {
			this.testTimer += delta;
		}
		if(this.testTimer > 3000) {
			this.rightRobot.testAttack("scan");
			this.testTimer = -999;
		}
	}

	updateProjectiles(t: number, d: number) {
		for(let pp = this.projs.length-1; pp >= 0; pp--) {
			this.projs[pp].tick(t,d);
			if(this.projs[pp].deleteFlag){
				this.projs[pp].destroy();
				this.projs.splice(pp,1);
			}
		}
	}

	updateEffects(t: number, d: number){
		for(let ee = this.effects.length-1; ee >= 0; ee--) {
			this.effects[ee].tick(t,d);
			if(this.effects[ee].deleteFlag){
				this.effects[ee].destroy();
				this.effects.splice(ee,1);
			}
		}
	}

	getTargetX(): number{
		return this.leftRobot.getTargetX();
	}

	getTargetY(): number{
		return this.leftRobot.getTargetY();
	}

	addEffect(b: BasicEffect){
		this.effectContainer.add(b);
		this.effects.push(b);
	}

	addProjectile(p: Projectile){
		this.projContainer.add(p);
		this.projs.push(p);
	}

	tickEffects(t: number, d: number){
		for(let ef = this.effects.length-1; ef >= 0; ef--) {
			this.effects[ef].update(t,d);
			if(this.effects[ef].deleteFlag){
				this.effects[ef].destroy();
				this.effects.splice(ef,1);
			}
		}
	}

	informHit(tag: string){
		if(this.currentTarget == -1) {
			this.leftRobot.takeHit(tag);
		} else if (this.currentTarget == 1) {
			this.rightRobot.takeHit(tag);
		}
	}


	initTouchControls() {
		/*
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			if (!this.player.isTouched) {
				this.player.touchStart(pointer.x, pointer.y);
				touchId = pointer.id;
				touchButton = pointer.button;
			}
			else if (this.player.isTouched && !this.player.isTapped) { // Use second touch point as a trigger
				this.player.doABarrelRoll();
			}
		});

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			if (touchId == pointer.id) {
				this.player.touchDrag(pointer.x, pointer.y);
			}
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			if (touchId == pointer.id && touchButton == pointer.button) {
				// this.ui.debug.setText(`${new Date().getTime()} - id:${pointer.id} button:${pointer.button}`);
				this.player.touchEnd(pointer.x, pointer.y);
			}
		});
		*/
	}
}
