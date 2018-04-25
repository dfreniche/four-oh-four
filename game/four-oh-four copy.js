var menuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MenuScene ()
    {
        Phaser.Scene.call(this, { key: 'menuScene' });
    },

    preload: function ()
    {
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('space-background', 'assets/img/space-background.png');
        this.load.image('raster', 'assets/img/raster-bw-800x16.png');
        this.load.image('spark', 'assets/img/blue.png');
        this.load.image('sun', 'assets/img/sun.png');
    },

    create: function ()
    {

        //  Background for our game.
        var background = this.add.image(400, 300, 'space-background');

        //  Center the picture in the game
        //Phaser.Display.Align.In.Center(background, this.add.zone(400, 250, 800, 500));
        var title = this.add.text(400, 50, 'Four-OH-Four').setFontFamily('Arial').setFontSize(80).setColor('#ffff00');
        title.setOrigin(0.5);

        var subTitle = this.add.text(400, 130, 'Help me find the droids!').setFontFamily('Arial').setFontSize(40).setColor('#ffff00');
        subTitle.setOrigin(0.5);

        var clickTitle = this.add.text(400, 230, 'Click to start').setFontFamily('Arial').setFontSize(20).setColor('#ffff00');
        clickTitle.setOrigin(0.5);
/*
        var bouncingShip = this.physics.add.sprite(100, 300, 'ship').setDisplaySize(50, 50);

        bouncingShip.setVelocity(100, 200);
        bouncingShip.setBounce(1, 1);
        bouncingShip.setCollideWorldBounds(true);
        bouncingShip.setAngularVelocity(-150);


        //this.doraster();

        
        var sun = this.physics.add.image(0, 0, 'sun').setDisplaySize(200, 200);
        sun.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        sun.setBounceX(Phaser.Math.FloatBetween(0.1, 3));
*/
        this.input.once('pointerdown', function () {

            console.log('From menuScene to gameScene');

            this.scene.start('gameScene');

        }, this);
    },

    // shows a nice raster effect phaser3-examples/public/view.html?src=src\demoscene\raster%20wave.js
    doraster: function()
    {   
        var group = this.add.group();

        group.createMultiple({ key: 'raster', repeat: 3 });
    
        var hsv = Phaser.Display.Color.HSVColorWheel();
    
        var i = 0;
    
        var _this = this;
    
        group.children.iterate(function (child) {
    
            child.x = 400;
            child.y = 500;
            child.depth = 64 - i;
    
            child.setTint(hsv[i * 4].color);
    
            i++;
    
            _this.tweens.add({
                targets: child,
                props: {
                    y: { value: 300, duration: 1500 },
                    scaleX: { value: child.depth / 64, duration: 6000, hold: 2000, delay: 2000 }
                },
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: 32 * i
            });
    
        });
    }
});


var gameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    gameOver: false,
    ship: null,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene' });
    },

    preload: function ()
    {
        this.load.image('exoplanet', 'assets/img/exoplanet.png');
        this.load.image('gas-giant', 'assets/img/gas-giant.png');
        this.load.image('ice-giant', 'assets/img/ice-giant.png');
        this.load.image('asteroids', 'assets/img/asteroids.png');

    },

    create: function ()
    {
        cursors = this.input.keyboard.createCursorKeys();

        //  Background for our game.
        var background = this.add.image(400, 300, 'space-background');  
        
        var planets = this.physics.add.staticGroup();
        var stars = this.physics.add.staticGroup();

        stars.create(400, 300, 'sun').setDisplaySize(100, 100).refreshBody();
        stars.create(130, 400, 'asteroids').setDisplaySize(100, 100).refreshBody();

        planets.create(100, 100, 'exoplanet').setDisplaySize(80, 80).refreshBody();
        planets.create(700, 400, 'gas-giant');
        planets.create(600, 100, 'ice-giant');        

        this.ship = this.physics.add.sprite(100, 300, 'ship').setDisplaySize(50, 50);
        this.ship.setCollideWorldBounds(true);
        this.ship.setDrag(300);
        this.ship.setAngularDrag(400);
        this.ship.setMaxVelocity(300);

        this.physics.add.collider(this.ship, planets, this.arrivedAtPlanet, null, this);
        this.physics.add.collider(this.ship, stars, this.crashed, null, this);
    },

    update: function() 
    {
        

        if (cursors.left.isDown)
        {
            this.ship.setAngularVelocity(-150);
        }
        else if (cursors.right.isDown)
        {
            this.ship.setAngularVelocity(150);
        }
        else
        {
            this.ship.setAngularVelocity(0);
        }

        if (cursors.up.isDown)
        {
            this.physics.velocityFromRotation(this.ship.rotation, 50, this.ship.body.acceleration);
        }

        if (cursors.down.isDown)
        {
            this.ship.setAcceleration(0);
        }
    },

    arrivedAtPlanet: function ( ship, planet ) {
        console.log('planet ' + planet);
    },
    crashed: function ( ship, star ) {
        console.log('CRASH ');

        var particles = this.add.particles('spark');

        var emitter = particles.createEmitter();

        emitter.setPosition(0, 0);
        emitter.setSpeed(10);
        emitter.setBlendMode(Phaser.BlendModes.ADD);

        emitter.startFollow(ship);

        ship.disableBody(true, true);

        this.gameOver = true;

        this.input.once('pointerdown', function () {
            console.log('From gameScene to menuScene');

            if (this.gameOver) {

                this.scene.start('menuScene');
            }
        }, this);
    }

});





var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [ menuScene, gameScene ]
};

var game = new Phaser.Game(config);

var score = 0;
var scoreText;

var musicFolder = 'assets/music/';








function setSpeedFacingDirection( sprite ) {
    var realAngle=0;
    var phaserAngle = sprite.angle;

    if (phaserAngle >= 0 && phaserAngle <= 90) {
        var tx=1;
        var ty=-1;
        realAngle = 360 - phaserAngle;
    }
    else if (phaserAngle > 90 && phaserAngle <= 180) {
        var tx=-1;
        var ty=-1;
        realAngle = 360 - phaserAngle;

    }
    else if (phaserAngle > -180 && phaserAngle < -90) {
        var tx=-1;
        var ty=1;
        realAngle = -1*phaserAngle;
    }
    else if (phaserAngle > -90 && phaserAngle < 0) {
        var tx=1;
        var ty=1;
        realAngle = -1*phaserAngle;
    }

    var trustX = Math.sin(Phaser.Math.DegToRad(realAngle));
    var trustY = Math.cos(Phaser.Math.DegToRad(realAngle));
    var velX = trustX*20 * tx;
    var velY = trustY*20 * ty;
    ship.setVelocity(velX, velY);

    console.log('trustX' + trustX.toFixed(2));
    console.log('trustY' + trustY.toFixed(2));
    console.log('velX' + velX.toFixed(2));
    console.log('velY' + velY.toFixed(2));
}



function preload() {
    console.log("Preload loading");

    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('oh-mummy-tune', 
                    [musicFolder + 'OH-Mummy-Amstrad-CPC.mp3', 
                     musicFolder + 'OH-Mummy-Amstrad-CPC.ogg']
                );

    
    /*
    this.load.spritesheet('dude', 'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    */
}

function create() {
    console.log("Create loading");

    // first = this.sound.add('oh-mummy-tune', { loop: false });
    // first.play();

    

    var sun = this.add.image(0, 0, 'sun').setDisplaySize(100, 100);

    //  Center the sprite to the picture
    Phaser.Display.Align.In.Center(sun, background);

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 0, end: 2 },
        blendMode: 'ADD'
    });
    
    
    
    
    var exoplanet = this.physics.add.image(400, 100, 'ship').setDisplaySize(50, 50);;

    exoplanet.setVelocity(100, 200);
    exoplanet.setBounce(1, 1);
    exoplanet.setCollideWorldBounds(true);

        /*
    var platforms = createPlatforms(this);
    var player = createPlayer(this);

    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
*/
    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    

    emitter.startFollow( exoplanet );
}



function createPlatforms(game) {
    platforms = game.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    return platforms;
}

function createPlayer(game) {
    console.log("Player");

    player = game.physics.add.sprite(100, 250, 'dude');

    player.setBounce(0.5);
    player.setCollideWorldBounds(true);

    game.anims.create({
        key: 'left',
        frames: game.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    game.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    game.anims.create({
        key: 'right',
        frames: game.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    return player;
}

function collectStar (player, star)
{
    star.setVelocityY(-330);
    //star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    color = getRandomColor();
    console.log(color)
    star.setTint(color);
}

function getRandomColor( format ){
    var rint = Math.floor( 0x100000000 * Math.random());
    switch( format ){
      case 'hex':
        return '#' + ('00000'   + rint.toString(16)).slice(-6).toUpperCase();
      case 'hexa':
        return '#' + ('0000000' + rint.toString(16)).slice(-8).toUpperCase();
      case 'rgb':
        return 'rgb('  + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ')';
      case 'rgba':
        return 'rgba(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ',' + (rint >> 24 & 255)/255 + ')';
      default:
        return rint;
    }
  }

  function emitter( scene, whoToFollow ){
    if (typeof scene === 'undefined') {
        return;
    }

    var particles = scene.add.particles('sun');

    var emitter = particles.createEmitter({
        speed: 300,
        scale: { start: 0, end: 2 },
        blendMode: 'ADD'
    });

    if (typeof whoToFollow !== 'undefined') {
        emitter.startFollow( whoToFollow );
    }
  }