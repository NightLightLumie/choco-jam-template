import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./Button";
import { PartAttribute } from "./RobotSeg";
import { AbilityOption } from "./Data/GlobalVariables";

export class SimpleButton extends Button {
	public index: number;
    public value: AbilityOption = {
        script: "",
        name: "",
        desc: "",
    }
    private sprite: Phaser.GameObjects.Sprite;
    private disabled: boolean = false;
    public tdisplay: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, v: AbilityOption, spr: string, fsize: number = 25) {
		super(scene, x, y);
        this.sprite = scene.add.sprite(0, 0, spr, 0);
        this.sprite.setOrigin(0.5,0.5);
        this.add(this.sprite);
        this.bindInteractive(this.sprite);
        this.value = v;
        this.tdisplay = scene.addText({ text: v.name, color: "white", size: fsize });
        this.tdisplay.setWordWrapWidth(200);
        this.tdisplay.setOrigin(0.5);
        this.add(this.tdisplay);
        this.index = -1;
        this.disabled = false;
	}

    center() {
        this.sprite.setOrigin(0.5,0.5);
        this.tdisplay.setOrigin(0.5,0.5);
    }

    reCenter(x:number,y:number) {
        this.sprite.setOrigin(x,y);
        this.tdisplay.setOrigin(x,y);
    }

    setValue(data: AbilityOption){
        this.value = data;
        //this.tdisplay.setText(this.value);
    }

    setIndex(i: number){
        this.index =  i;
    }

    veil(){
        this.sprite.setAlpha(0.5);
        this.sprite.disableInteractive();
        this.disableInteractive();
    }

    unveil(){
        this.sprite.setAlpha(1);
        this.sprite.setInteractive();
        this.setInteractive();
    }

    turnOff(){
        this.sprite.input!.enabled = false;
        this.disabled = true;
        this.resetState();
    }

    turnOn(){
        this.sprite.input!.enabled = true;
        this.disabled = false;
        this.resetState();
    }

    resetState(){
        this.tdisplay.setColor("white");
        this.sprite.setFrame(0);
    }

    onDown(
        pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
    ) {
        if (!this.disabled) {
            super.onDown(pointer, localX, localY, event);
            this.tdisplay.setColor("yellow");
            this.sprite.setFrame(1);
        }
    }
    onUp(
        pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
    ) {
        if (!this.disabled) {
            super.onUp(pointer, localX, localY, event);
            //this.tdisplay.setColor("white");
            //this.sprite.setFrame(0);
        }
    }

    release(){
        this.tdisplay.setColor("white");
        this.sprite.setFrame(0);
    }

    highlight(){
        this.tdisplay.setColor("yellow");
        this.sprite.setFrame(2);
    }

    unhighlight(){
        this.tdisplay.setColor("yellow");
        this.sprite.setFrame(1);
    }
}
