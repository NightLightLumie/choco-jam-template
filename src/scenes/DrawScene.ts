import { BaseScene } from "@/scenes/BaseScene";
//import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { AbilityOption, GlobalVariables } from "@/components/Data/GlobalVariables";
import { SimpleButton } from "@/components/SimpleButton";
import { NextSceneButton } from "@/components/NextSceneButton";

//import { NextSceneButton } from "@/components/elements/NextSceneButton";
//import { GlobalVariables } from "@/components/GlobalVariables";


export class DrawScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
    private overlay: Phaser.GameObjects.Image;
    public dataHandler: GlobalVariables;
	private ui: UI;
	public timer: number = 3000;
	public curProjID: number = 0;
    //public nextSceneButton: NextSceneButton;
    public index: number = 0;
    //public imageList: string[] = ["widgets_0", "widgets_1", "widgets_2", "widgets_3", "widgets_4"];
    public fadeTimer: number = 500;
    public waitTimer: number = 1000;

    public hb1: SimpleButton;
    public hb2: SimpleButton;
    public hb3: SimpleButton;

    public tb1: SimpleButton;
    public tb2: SimpleButton;
    public tb3: SimpleButton;

    public ab1: SimpleButton;
    public ab2: SimpleButton;
    public ab3: SimpleButton;

    public lb1: SimpleButton;
    public lb2: SimpleButton;
    public lb3: SimpleButton;

    public nextButton: NextSceneButton;

    public lastHighlight: SimpleButton;

    public title: Phaser.GameObjects.Text;
    public tdisplay: Phaser.GameObjects.Text;

    //
	constructor() {
		super({ key: "DrawScene" });

		//this.dataHandler = new GlobalVariables();

		//this.bb = new Phaser.GameObjects.Container(this);

	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.dataHandler = data.gameData;
	}

	create(): void {
		this.fade(false, 600, 0x000000);
		this.background = this.add.image(0, 0, "bkgbuild");
		this.background.setOrigin(0);
		this.background.setDepth(-3);
        this.fitToScreen(this.background);
        this.overlay = this.add.image(0, 0, "blank_bkg");
		this.overlay.setOrigin(0);
		this.overlay.setDepth(-1);
        this.overlay.setAlpha(0);
		this.fitToScreen(this.overlay);
		//his.nextSceneButton = new NextSceneButton(this,1792,952);
        //this.nextSceneButton.veil();
        this.waitTimer = 1000;
        this.title = this.addText({
			x: 112,
			y: 160,
			size: 30,
			color: "#000000",
			text: "",
		});
        this.tdisplay = this.addText({
			x: 112,
			y: 400,
			size: 25,
			color: "#000000",
			text: "",
		});
        this.title.setWordWrapWidth(340);
        this.tdisplay.setWordWrapWidth(340);
        console.log("ARRAY 1 : " + this.dataHandler.rightBotChoices);
        console.log("ARRAY 2 : " + this.dataHandler.leftBotChoices)

        this.hb1 = new SimpleButton(this,660,180,this.cloneData(this.dataHandler.getAbilityChoice(1,0,0)),"sqbutton",20);
        this.hb2 = new SimpleButton(this,940,180,this.cloneData(this.dataHandler.getAbilityChoice(1,0,1)),"sqbutton",20);
        this.hb3 = new SimpleButton(this,1200,180,this.cloneData(this.dataHandler.getAbilityChoice(1,0,2)),"sqbutton",20);
        this.initHeadButtonControls();

        this.tb1 = new SimpleButton(this,660,400,this.cloneData(this.dataHandler.getAbilityChoice(1,1,0)),"sqbutton",20);
        this.tb2 = new SimpleButton(this,940,400,this.cloneData(this.dataHandler.getAbilityChoice(1,1,1)),"sqbutton",20);
        this.tb3 = new SimpleButton(this,1200,400,this.cloneData(this.dataHandler.getAbilityChoice(1,1,2)),"sqbutton",20);
        this.initTorsoButtonControls();

        this.ab1 = new SimpleButton(this,660,620,this.cloneData(this.dataHandler.getAbilityChoice(1,2,0)),"sqbutton",20);
        this.ab2 = new SimpleButton(this,940,620,this.cloneData(this.dataHandler.getAbilityChoice(1,2,1)),"sqbutton",20);
        this.ab3 = new SimpleButton(this,1200,620,this.cloneData(this.dataHandler.getAbilityChoice(1,2,2)),"sqbutton",20);
        this.initArmButtonControls();

        this.lb1 = new SimpleButton(this,660,840,this.cloneData(this.dataHandler.getAbilityChoice(1,3,0)),"sqbutton",20);
        this.lb2 = new SimpleButton(this,940,840,this.cloneData(this.dataHandler.getAbilityChoice(1,3,1)),"sqbutton",20);
        this.lb3 = new SimpleButton(this,1200,840,this.cloneData(this.dataHandler.getAbilityChoice(1,3,2)),"sqbutton",20);
        this.initLegButtonControls();

        this.hb1.highlight();
        this.lastHighlight = this.hb1;
        this.tb1.unhighlight();
        this.ab1.unhighlight();
        this.lb1.unhighlight();

        this.title.setText(this.hb1.value.name);
        this.tdisplay.setText(this.hb1.value.desc);

        this.nextButton = new NextSceneButton(this,130,900);
        this.nextButton.veil();
        this.nextButton.on("click", ()=> {
            this.endStage();
        });

        this.dataHandler.rightBotAbilities = [
            this.cloneData(this.hb1.value),
            this.cloneData(this.tb1.value),
            this.cloneData(this.ab1.value),
            this.cloneData(this.lb1.value) ]
	}

    cloneData(a: AbilityOption): AbilityOption{
        return {
            script: a.script,
            name: a.name,
            desc: a.desc,
        }
    }

    initHeadButtonControls(){
        this.hb1.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.hb1.highlight();
            this.lastHighlight = this.hb1;
            this.refreshText();
            this.hb2.release();
            this.hb3.release();
        });
        this.hb2.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.hb2.highlight();
            this.lastHighlight = this.hb2;
            this.refreshText();
            this.hb1.release();
            this.hb3.release();
        });
        this.hb3.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.hb3.highlight();
            this.lastHighlight = this.hb3;
            this.refreshText();
            this.hb1.release();
            this.hb2.release();
        });
    }

    initTorsoButtonControls(){
        this.tb1.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.tb1.highlight();
            this.lastHighlight = this.tb1;
            this.refreshText();
            this.tb2.release();
            this.tb3.release();
        });
        this.tb2.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.tb2.highlight();
            this.lastHighlight = this.tb2;
            this.refreshText();
            this.tb1.release();
            this.tb3.release();
        });
        this.tb3.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.tb3.highlight();
            this.lastHighlight = this.tb3;
            this.refreshText();
            this.tb1.release();
            this.tb2.release();
        });
    }

    initArmButtonControls(){
        this.ab1.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.ab1.highlight();
            this.lastHighlight = this.ab1;
            this.refreshText();
            this.ab2.release();
            this.ab3.release();
        });
        this.ab2.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.ab2.highlight();
            this.lastHighlight = this.ab2;
            this.refreshText();
            this.ab1.release();
            this.ab3.release();
        });
        this.ab3.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.ab3.highlight();
            this.lastHighlight = this.ab3;
            this.refreshText();
            this.ab1.release();
            this.ab2.release();
        });
    }

    initLegButtonControls(){
        this.lb1.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.lb1.highlight();
            this.lastHighlight = this.lb1;
            this.refreshText();
            this.lb2.release();
            this.lb3.release();
        });
        this.lb2.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.lb2.highlight();
            this.lastHighlight = this.lb2;
            this.refreshText();
            this.lb1.release();
            this.lb3.release();
        });
        this.lb3.on("click", ()=> {
            if(this.lastHighlight != null){
                this.lastHighlight.unhighlight();
            }
            this.lb3.highlight();
            this.lastHighlight = this.lb3;
            this.refreshText();
            this.lb1.release();
            this.lb2.release();
        });
    }
    refreshText(){
        this.title.setText(this.lastHighlight.value.name);
        this.tdisplay.setText(this.lastHighlight.value.desc);
    }

	update(time: number, delta: number) {
        if(this.waitTimer > 0)
        {
            this.waitTimer -= delta;
            if(this.waitTimer <= 0) {
                //this.endStage();
                this.nextButton.unveil();
            }
        }

	}

	endStage(){
        //this.dataHandler.seenTransition = true;
		this.scene.start("GameScene", {dataHandler: this.dataHandler});
	}


	initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			/*
			if (!this.player.isTouched) {
				this.player.touchStart(pointer.x, pointer.y);
				touchId = pointer.id;
				touchButton = pointer.button;
			}
			else if (this.player.isTouched && !this.player.isTapped) { // Use second touch point as a trigger
				this.player.doABarrelRoll();
			}
			*/

		});

		/*
		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {

			if (touchId == pointer.id) {
				this.player.touchDrag(pointer.x, pointer.y);
			}

		});
		*/

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			/*
			if (touchId == pointer.id && touchButton == pointer.button) {
				// this.ui.debug.setText(`${new Date().getTime()} - id:${pointer.id} button:${pointer.button}`);
				this.player.touchEnd(pointer.x, pointer.y);
			} 
			*/

		});
	}
}
