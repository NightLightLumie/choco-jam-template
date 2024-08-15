import * as Neutralino from '@neutralinojs/lib';
type Neutralino = typeof Neutralino;

const NeutralinoLoad = (Neutralino: Neutralino) => {
    Neutralino.window.center();
    Neutralino.events.on("windowClose", () => {
        Neutralino.app.exit();
    });
}

if( window.NL_TOKEN ) {
    Neutralino.init();
    NeutralinoLoad(Neutralino);
}
