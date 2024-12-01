import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Robot } from "@/components/Robot";
import { BasicEffect } from "@/components/BasicEffect";
import { Projectile } from "@/components/Projectile";
import { GlobalVariables } from "@/components/Data/GlobalVariables";
import { SimpleButton } from "@/components/SimpleButton";
import { ActionButton } from "@/components/ActionButton";

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

	public dataHandler: GlobalVariables;

	public hb: SimpleButton;
	public tb: SimpleButton;
	public ab: SimpleButton;
	public lb: SimpleButton;

	public selectedButton: SimpleButton;

	public phaseTimer: number[] = [3000];
	public curPhase: number = -1;
	public actionOrder: number[] = [1,-1];

	public testTimer: number = 0;
	constructor() {
		super({ key: "GameScene" });
	}

	init(data: { dataHandler: GlobalVariables; })
	{
		console.log('init, data');
		this.dataHandler = data.dataHandler;
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.ui = new UI(this);

		this.initTouchControls();

		this.rightRobot = new Robot(this,1600,520, -1);
		this.leftRobot = new Robot(this,320,520, 1);

		this.effects = [];
		this.effectContainer = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.effectContainer);

		this.projs = [];
		this.projContainer = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.projContainer);

		this.hb = new SimpleButton(this,540,830,this.dataHandler.rightBotAbilities[0],"sqbutton",25);
		this.hb.index = 0;
		this.hb.on("click", ()=> {
            if(this.selectedButton != null){
                this.selectedButton.unhighlight();
            }
            this.hb.highlight();
            this.selectedButton = this.hb;
            this.tb.release();
            this.ab.release();
			this.lb.release();
        });
		this.tb = new SimpleButton(this,820,830,this.dataHandler.rightBotAbilities[1],"sqbutton",25);
		this.tb.index = 1;
		this.tb.on("click", ()=> {
            if(this.selectedButton != null){
                this.selectedButton.unhighlight();
            }
            this.tb.highlight();
            this.selectedButton = this.tb;
            this.hb.release();
            this.ab.release();
			this.lb.release();
        });
		this.ab = new SimpleButton(this,1100,830,this.dataHandler.rightBotAbilities[2],"sqbutton",25);
		this.ab.index = 2;
		this.ab.on("click", ()=> {
            if(this.selectedButton != null){
                this.selectedButton.unhighlight();
            }
            this.ab.highlight();
            this.selectedButton = this.ab;
            this.tb.release();
            this.hb.release();
			this.lb.release();
        });
		this.lb = new SimpleButton(this,1380,830,this.dataHandler.rightBotAbilities[3],"sqbutton",25);
		this.lb.index = 3;
		this.lb.on("click", ()=> {
            if(this.selectedButton != null){
                this.selectedButton.unhighlight();
            }
            this.lb.highlight();
            this.selectedButton = this.lb;
            this.tb.release();
            this.ab.release();
			this.hb.release();
        });

		this.hb.highlight();
		this.selectedButton = this.hb;
		this.hideButtons();
	}

	proceed(){

	}

	queueAction(){
		if(this.selectedButton != null) {
			this.rightRobot.queueAction(this.selectedButton.index, this.selectedButton.value.script);
		}
	}

	update(time: number, delta: number) {
		/*
		switch(this.curPhase){
			case -1: {
				this.phaseTimer[0] -= delta;
				if(this.phaseTimer[0] <= 0) {
					this.curPhase = 0;
					this.phaseTimer = [5000];
				}
				break;
			} case 0: {
				this.phaseTimer[0] -= delta;
				if(this.phaseTimer[0] <= 0) {
					this.queueAction();
					this.curPhase = 1;
					this.phaseTimer = [5000];
					if(this.rightRobot.speed >= this.leftRobot.speed){
						this.actionOrder = [1, -1];
						this.rightRobot.executeAction();
					} else {
						this.actionOrder = [-1, 1];
						this.leftRobot.executeAction();
					}
				}
				break;
			} case 1 : {
				switch(this.actionOrder[0]){
					case 1: {
						if(!this.rightRobot.dynamic){
							this.curPhase = 2;
							this.phaseTimer = [1000];
						}
						break;
					} case -1: {
						if(!this.leftRobot.dynamic){
							this.curPhase = 2;
							this.phaseTimer = [1000];
						}
						break;
					} default: {
						break;
					}
				}
				break;
			} case 2: {
				this.phaseTimer[0] -= delta;
				if(this.phaseTimer[0] <= 0) {
					this.curPhase = 3;
					this.phaseTimer = [];
					switch(this.actionOrder[1]){
						case 1: {
							this.rightRobot.executeAction();
							break;
						} case -1: {
							this.leftRobot.executeAction();
							break;
						} default: {
							break;
						}
					}
				}
				break;
			} case 3: {
				switch(this.actionOrder[1]){
					case 1: {
						if(!this.rightRobot.dynamic){
							this.curPhase = 2;
							this.phaseTimer = [1000];
						}
						break;
					} case -1: {
						if(!this.leftRobot.dynamic){
							this.curPhase = 2;
							this.phaseTimer = [1000];
						}
						break;
					} default: {
						break;
					}
				}
				break;
			} case 99: {
				break;
			} default: {
				break;
			}
		}*/
		this.rightRobot.tick(time,delta);
		this.leftRobot.tick(time,delta);
		this.updateProjectiles(time, delta);
		this.updateEffects(time, delta);
		
		if(this.testTimer >= 0) {
			this.testTimer += delta;
		}
		if(this.testTimer > 3000) {
			this.rightRobot.testAttack(2,"rocketpunch");
			this.testTimer = -999;
		}
	}

	hideButtons(){
		this.hb.setVisible(false);
		this.tb.setVisible(false);
		this.ab.setVisible(false);
		this.lb.setVisible(false);
	}

	showButtons(){
		this.hb.setVisible(true);
		this.tb.setVisible(true);
		this.ab.setVisible(true);
		this.lb.setVisible(true);
	}

	filterButtons(){
		if(!this.rightRobot.myHead.alive) {
			this.hb.setVisible(false);
		}
		if(!this.rightRobot.myTorso.alive) {
			this.tb.setVisible(false);
		}
		if(!this.rightRobot.myArms.alive){
			this.ab.setVisible(false);
		}
		if(!this.rightRobot.myLegs.alive){
			this.lb.setVisible(false);
		}
	}

	beginRound(){
		this.showButtons();
		this.filterButtons();
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

	informHitByPart(tag: string, nx: number[]){
		if(nx[0] == -1) {
			this.leftRobot.takeHitByPart(tag, nx[1]);
		} else if (nx[0] == 1) {
			this.rightRobot.takeHitByPart(tag, nx[1]);
		}
	}

	getActivePartID(): number{
		if(this.currentTarget == -1) {
			return this.leftRobot.getCurrentPartID();
		} else if (this.currentTarget == 1) {
			return this.rightRobot.getCurrentPartID();
		} else {
			return 0;
		}
	}

	getTargetedBot():Robot {
		if(this.currentTarget == -1) {
			return this.leftRobot;
		} else if (this.currentTarget == 1) {
			return this.rightRobot;
		} else {
			return this.leftRobot;
		}
	}

	getBotFromDirection(n: number):Robot {
		if(n == -1) {
			return this.leftRobot;
		} else if (n == 1) {
			return this.rightRobot;
		} else {
			return this.leftRobot;
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
