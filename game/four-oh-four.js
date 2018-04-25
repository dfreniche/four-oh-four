var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MenuScene ()
    {
        Phaser.Scene.call(this, { key: 'MenuScene' });
    },

    preload: function ()
    {
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('space-background', 'assets/img/space-background.png');
        this.load.image('raster', 'assets/img/raster-bw-800x16.png');
        this.load.image('spark', 'assets/img/blue.png');
        this.load.image('sun', 'assets/img/sun.png');

        // retro font

        this.load.image('knighthawks', 'assets/fonts/knighthawks-font.png');
    },

    create: function ()
    {

        //  Background for our game.
        var background = this.add.image(400, 300, 'space-background');
        background.setInteractive();

        configRetroTitle( this, ' 404 - NOT FOUND - 404 - NOT FOUND ' );

        this.tweens.add({
            targets: dynamic,
            duration: 3000,
            y: 175*2,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
        
        var subTitle = this.add.text(400, 130, 'Help me find the droids!').setFontFamily('Arial').setFontSize(40).setColor('#ffff00');
        subTitle.setOrigin(0.5);

        var clickTitle = this.add.text(400, 230, 'Click to start').setFontFamily('Arial').setFontSize(20).setColor('#ffff00');
        clickTitle.setOrigin(0.5);
        clickTitle.setInteractive();

        var credits = this.add.text(600, 400, 'Credits').setFontFamily('Arial').setFontSize(30).setColor('#ffff00');
        credits.setInteractive();
        credits.setOrigin(0.5);
        
        var bouncingShip = this.physics.add.sprite(100, 300, 'ship').setDisplaySize(50, 50);

        bouncingShip.setVelocity(100, 200);
        bouncingShip.setBounce(1, 1);
        bouncingShip.setCollideWorldBounds(true);
        bouncingShip.setAngularVelocity(-150);

        var particles = this.add.particles('spark');

        var emitter = particles.createEmitter();

        emitter.setPosition(400, 500);
        emitter.setSpeed(100);
        emitter.setBlendMode(Phaser.BlendModes.ADD);

        
        var sun = this.physics.add.image(0, 0, 'sun').setDisplaySize(200, 200);
        sun.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        sun.setBounceX(Phaser.Math.FloatBetween(0.1, 3));

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log('From menuScene to credits');

            if (gameObject === credits) {
                this.scene.start('CreditsScene');
            } else {
                this.scene.start('GameScene');
            }           
        }, this);
    },

    update: function (time, delta)
    {
        dynamic.scrollX += 0.15 * delta;

        if (dynamic.scrollX > 1300)
        {
            dynamic.scrollX = 0;
        }
    }
});


var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    gameOver: false,
    ship: null,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function ()
    {
        this.gameOver = false;

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
        if (this.gameOver) {
            this.showGameOver();

            return;
        }

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
        this.ship.setAcceleration(0);

        var title = this.add.text(400, 200, ['Found productive droids!', 'They\'re at Teamwork!', 'Click to go there']).setFontFamily('Arial').setFontSize(40).setColor('#ffff00');
        title.setOrigin(0.5);

        this.input.once('pointerdown', function () {
            window.location.href = "http://www.teamwork.com";
        }, this);
    },

    crashed: function ( ship, star ) {
        console.log('CRASH ');
        configRetroTitle( this, ' GAME OVER - CLICK TO CONTINUE - GAME OVER - CLICK TO CONTINUE - GAME OVER - CLICK TO CONTINUE - ' );
        this.gameOver = true;

        this.physics.pause();
        
        var particles = this.add.particles('spark');

        var emitter = particles.createEmitter();

        emitter.setPosition(0, 0);
        emitter.setSpeed(10);
        emitter.setBlendMode(Phaser.BlendModes.ADD);

        emitter.startFollow(ship);

        this.ship.disableBody(true, true);
        // this.doraster();

        this.input.once('pointerdown', function () {
            console.log('From gameScene to menuScene');

            if (this.gameOver) {
                this.scene.start('MenuScene');
            }
        }, this);
    },

     // shows a nice raster effect phaser3-examples/public/view.html?src=src\demoscene\raster%20wave.js
     doraster: function()
     {   
         var group = this.add.group();
 
         group.createMultiple({ key: 'raster', repeat: 64 });
     
         var hsv = Phaser.Display.Color.HSVColorWheel();
     
         var i = 0;
     
         var _this = this;
     
         group.children.iterate(function (child) {
     
             child.x = 400;
             child.y = 100;
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
     },

     showGameOver: function () {
        dynamic.scrollX += 4;

        if (dynamic.scrollX >= 32)
        {
            //  Remove first character
            var current = dynamic.text.substr(1);
    
            //  Add next character from the string
            current = current.concat(content[i]);
    
            i++;
    
            if (i === content.length)
            {
                i = 0;
            }
    
            //  Set it
            dynamic.setText(current);
    
            //  Reset scroller
            dynamic.scrollX = dynamic.scrollX % 32;
        }
     }

});


var CreditsScene = new Phaser.Class({

    Extends: Phaser.Scene,

    scroller: null,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'CreditsScene' });
    },

    preload: function ()
    {
        this.load.bitmapFont('carrier', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    },

    create: function ()
    {
    
        var content = 
            ["",
            "",
            "",
            "This little game", "",
            "was created during", "",
            "Teamwork's 2018", "",
            "Spring Hackathon.", "",
            "Thanks to Peter and", "",
            "& Dan for the time", "",
            "to scratch this itch:", "",
            "creating my first", "",
            "game after more", "",
            "than 25 years.", "",
            "",
            "",
            "",
            "Tools used:", "",
            "Phaser 3 JS engine", "",
            "Art: Ram Zorkot(Tatermand)", "",
            "",
            "",
            "Click to go back"
        
        ];

        scroller = this.add.dynamicBitmapText(0, 50, 'carrier', content, 25);

        scroller.setSize(1024, 400);
        scroller.setInteractive();

        var phaser = this.add.text(600, 480, 'Phaser 3').setFontFamily('Arial').setFontSize(30).setColor('#ffff00');
        phaser.setInteractive();
        phaser.setOrigin(0.5);


        var art = this.add.text(100, 480, 'Art').setFontFamily('Arial').setFontSize(30).setColor('#ffff00');
        art.setInteractive();
        art.setOrigin(0.5);

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log('From menuScene to credits');

            if (gameObject === phaser) {
                window.location.href = "https://phaser.io/";
            } else if (gameObject === art) {
                window.location.href = "https://opengameart.org/users/tatermand";
            } else {
                this.scene.start('MenuScene');
            }          
        }, this);
    },

    update: function(time, delta) 
    {
        scroller.scrollY += 0.02 * delta;

        if (scroller.scrollY > 2100)
        {
            scroller.scrollY = 0;
        }
    }
});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [ MenuScene, GameScene, CreditsScene ]
};

var game = new Phaser.Game(config);

var score = 0;
var scoreText;

var musicFolder = 'assets/music/';

var i = 0;
var dynamic;
var content;


function configRetroTitle ( parent, text ) {
    var config = {
        image: 'knighthawks',
        width: 32,
        height: 25,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
        charsPerRow: 10
    };

    parent.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(parent, config));
    
    dynamic = parent.add.dynamicBitmapText(0, 0, 'knighthawks', text);
    dynamic.setScale(4);
 }
