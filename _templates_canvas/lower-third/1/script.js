
/*
PixiJS
Documentation:
http://pixijs.download/release/docs/index.html
Examples:
http://pixijs.github.io/examples/#/basics/basic.js
*/

var options = {
    delay: 3000,
    backgroundColor: 0x000000,
    transparent: false
};

var isPaused = false;

var app = new PIXI.Application(1280, 720, {
    backgroundColor: options.backgroundColor,
    transparent: options.transparent
});
document.body.appendChild(app.view);

//Line
var line = new PIXI.Graphics();
line.beginFill(0xffffff, 1);
line.drawRect(-600, 450, 550, 4);//x, y, w, h
app.stage.addChild( line );

//Text container
var text1Container = new PIXI.Container();
text1Container.x = -600;
app.stage.addChild( text1Container );

//Text 2
var text2 = new PIXI.Text(('Subtitle'), new PIXI.TextStyle({
    fill: '#ffffff',
    fontSize: 36,
    textTransform: 'uppercase'
}));
text2.x = 70;
text2.y = 480;
text1Container.addChild( text2 );

//Rectangle
var rect = new PIXI.Graphics();
rect.beginFill(0x960e29, 1);
rect.drawRect(40, 460, 550, 80);//x, y, w, h
text1Container.addChild( rect );

//Text 1
var text1 = new PIXI.Text(('Text title').toUpperCase(), new PIXI.TextStyle({
    fill: '#ffffff',
    fontSize: 36,
    textTransform: 'uppercase'
}));
text1.x = 70;
text1.y = 480;
text1Container.addChild( text1 );

app.renderer.render( text1Container );

//Actions
//http://git.hust.cc/pixi-action/
var action_lineIn = new PIXI.action.MoveTo(2000, 0, 1),
    action_lineOut = new PIXI.action.MoveTo(0, 0, 1),
    action_lineDelay = new PIXI.action.DelayTime( options.delay / 1000 + 1 );

var action_moveIn = new PIXI.action.MoveTo(40, 0, 1),
    action_moveOut = new PIXI.action.MoveTo(-600, 0, 1),
    action_text2In = new PIXI.action.MoveBy(0, 80, 1),
    action_text2Out = new PIXI.action.MoveBy(0, -80, 1),
    action_delay = new PIXI.action.DelayTime( options.delay / 1000 );

var action_text2InFunc = new PIXI.action.CallFunc(function() {
    PIXI.actionManager.runAction(text2, action_text2In);
});
var action_text2OutFunc = new PIXI.action.CallFunc(function() {
    PIXI.actionManager.runAction(text2, action_text2Out);
});

var action_line_seq = new PIXI.action.Sequence([
    action_lineIn,
    action_lineDelay,
    action_lineOut
]);
PIXI.actionManager.runAction(line, action_line_seq);

/*
var lineAnimation = PIXI.actionManager.runAction(line, action_lineIn);
lineAnimation.on('end', function(elapsed) {
    PIXI.actionManager.runAction(line, action_lineOut);
});
*/

//Animation sequence
var action_seq = new PIXI.action.Sequence([
    new PIXI.action.DelayTime(0.5),
    action_moveIn,
    action_text2InFunc, new PIXI.action.DelayTime(1),
    action_delay,
    action_text2OutFunc, new PIXI.action.DelayTime(1),
    action_moveOut
]);
PIXI.actionManager.runAction(text1Container, action_seq);

app.ticker.add(function( time ) {
    if( !isPaused ) {
        app.renderer.render(app.stage);
        PIXI.actionManager.update();
    }
});

/*
function animate() {
    if( !isPaused ){
        app.renderer.render( app.stage );
        PIXI.actionManager.update();
    }
    window.requestAnimationFrame( animate );
}
animate();
*/

var animationPauseToggle = function(pause){
    if( typeof pause === 'undefined' ){
        isPaused = !isPaused;
    } else {
        isPaused = pause;
    }
    if( !isPaused ){
        //animate();
    }
};

var animationRestart = function(){
    console.log( 'animationRestart' );
};
