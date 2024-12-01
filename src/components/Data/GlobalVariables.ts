import { PartAttribute } from "../RobotSeg";

export interface AbilityOption{
    script: string;
    name: string;
    desc: string;
}

export class GlobalVariables{
    // corresponds to part IDs: 0 = head, 1 = torso, 2 = arms, 3 = legs
    public rightBotScripts: string[];
    public leftBotScripts: string[];

    public rightBotParts: PartAttribute[];
    public leftBotParts: PartAttribute[];

    public rightBotAbilities: AbilityOption[];
    public leftBotAbilities: AbilityOption[];

    public rightBotChoices: AbilityOption[][];
    public leftBotChoices: AbilityOption[][];

    public headOptions: AbilityOption[] = [{script:"laser_eye", name: "Eye Beam", desc:"Shoot a devastating laser blast. Deals heavy damage to one target."},
    {script:"headbutt", name: "Headbutt", desc:"A concussive physical attack. Deals medium damage, and is especially damaging to other noggins."},
    {script:"scan", name: "Scanner Sweep", desc:"Use high-tech sensors to detect and dodge the next two attacks."},
    {script:"gun_turret", name: "Turret Barrage", desc:"Activates a turret to fire at your opponent. Deals light damage, but can hit many times."},
    {script:"anger", name: "Nasty Plot", desc:"Think angry and devious thoughts. Sharply raises the damage of the next attack."}];

    public TorsoOptions: AbilityOption[] = [{script:"saw", name: "Saw Launcher", desc:"Launch a high-speed saw blade. Deals heavy damage, especially against limbs."},
    {script:"repair_bots", name: "Repair Droid", desc:"Handy nanotech-powered repair droids. Use these to heal the most injured parts."},
    {script:"clap", name: "Clap Cheeks", desc:"A clever tactic to disrupt an unsuspecting enemy. Deals damage to yourself, but guaranteed to stun the enemy."},
    {script:"pans", name: "Double Frying Pans", desc:"Beat the enemy with frying pans. Sometimes misses, but can also hit especially hard!"},
    {script:"danmaku", name: "Danmaku", desc:"Unleash bullet hell to mow down your opponent! Deals massive and indiscriminate damage, but leaves you vulnerable. Only usable once."}];

    public ArmOptions: AbilityOption[] = [{script:"rocketpunch", name: "Rocket Punch", desc:"Pummel your opponent, even at range! Deals moderate damage. Aim for the head!"},
    {script:"fireblast", name: "Dragonfire", desc:"Blasts of dragon fire are even effective against robots. Deals damage based on health."},
    {script:"escargot", name: "Escargot", desc:"Throw hazardous snails onto the ground. It takes a while to reach the opponent, but does massive damage."},
    {script:"resupply", name: "Extra Supplies", desc:"Beat the enemy with frying pans. Sometimes misses, but also sometimes crits."},
    {script:"missile", name: "Missile Gauntlet", desc:"Missiles are the best on robots. Deals heavy damage, and and also deals splash damage to everything nearby."}];

    public LegOptions: AbilityOption[] = [{script:"Boosters", name: "Boosters", desc:"Fly for a short time! Avoids annoying snails and raises your speed."},
    {script:"katanaboots", name: "Katana Boots", desc:"Hurl swords at your enemy using your legs. Cuts at the opposing part for moderate damage, as well as two other random targets."},
    {script:"stone_edge", name: "Stalagmite", desc:"Use your aura to make a stalagmite grow under the opponent. Does excellent damage, but can't hit the head."},
    {script:"curse", name: "Bad Luck", desc:"Stomp on a crack and inflict bad luck on the enemy. The degree of misfortune can vary."},
    {script:"bees", name: "Flood of Bees", desc:"Shoot an unreasonable amount of bees from your shoes. Does extra damage to the body, and executes low health targets."}];

    public taunts: string[] = [
        "Where did you get those legs from, IKEA?",
        "Your mother was artificially unintelligent.",
        "What are you running, Windows 98?",
        "You fight like a Roomba.",
        "Go back to the scrap heap.",
        "Give up, bucket of bolts.",
        "I was made for war. You were made for customer service.",
        "Prepare to have your rear chassis dented.",
        "I know calculators with more RAM than you.",
        "You've lost your cookies.",
    ]
    
    constructor(){
        //ID, owned, used
        this.rightBotChoices = [];
        this.leftBotChoices = [];
        this.rightBotAbilities = [];
        this.leftBotAbilities = [];
        this.rightBotParts = [];
        this.leftBotParts = [];
        this.rightBotScripts = [];
        this.leftBotScripts = [];
        this.repopulateFull();
    }

    cloneData(s: AbilityOption): AbilityOption{
        return {
            script: s.script,
            name: s.name,
            desc: s.desc,
        }
    }

    repopulateFull(){
        this.populateChoices(this.headOptions,0,-1);
        this.populateChoices(this.TorsoOptions,1,-1);
        this.populateChoices(this.ArmOptions,2,-1);
        this.populateChoices(this.LegOptions,3,-1);

        this.populateChoices(this.headOptions,0,1);
        this.populateChoices(this.TorsoOptions,1,1);
        this.populateChoices(this.ArmOptions,2,1);
        this.populateChoices(this.LegOptions,3,1);
    }

    getAbilityChoice(botID: number, i1: number, i2: number): AbilityOption{
        if(botID == -1){
            return this.leftBotChoices[i1][i2];
        } else if (botID == 1) {
            return this.rightBotChoices[i1][i2];
        } else {
            return {
                script: "",
                name: "",
                desc: "",
            }
        }
    }

    populateChoices(st: AbilityOption[], index: number, botIndex: number){
        let rt = [0, 1, 2, 3];
        let v1 = Math.trunc(Math.random()*rt.length);
        let q1 = rt[v1];
        rt.splice(v1,1);

        v1 = Math.trunc(Math.random()*rt.length);
        let q2 = rt[v1];
        rt.splice(v1,1);

        v1 = Math.trunc(Math.random()*rt.length);
        let q3 = rt[v1];
        rt.splice(v1,1);

        if(botIndex == -1){
            this.leftBotChoices[index] = [this.cloneData(st[q1]), this.cloneData(st[q2]), this.cloneData(st[q3])];
        } else if (botIndex == 1) {
            this.rightBotChoices[index] = [this.cloneData(st[q1]), this.cloneData(st[q2]), this.cloneData(st[q3])];
        }
    }



}