import Phaser from "phaser";
import ImgBackground from "./assets/images/TempleHallForest.jpg";
import ImgGround from "./assets/images/platform.png";
import ImgStar from "./assets/images/star.png";
import ImgBomb from "./assets/images/bomb.png";
import ImgDude from "./assets/images/dude.png";
import ImgGameOver from "./assets/images/ayu.png";


// 使用 Web Audio API
var audioContext;
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.error(e);
}

//游戏开始菜单
var MainMenu = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function Game() {
    Phaser.Scene.call(this, "mainmenu");

    this.pic;
  }, 
  
  preload: function () {
    console.log("读取资源开始");
    this.load.bitmapFont(
      "desyrel",
      "src/assets/fonts/font.png",
      "src/assets/fonts/font.xml"
    ); //加载字体
     
    this.load.image("background", ImgBackground); //背景图
    this.load.image("ImgGameOver", ImgGameOver); //游戏结束图片
    this.load.image("ground", ImgGround); //平台图
    this.load.image("star", ImgStar); //星星
    this.load.image("bomb", ImgBomb); //炸弹
    this.load.spritesheet("dude", ImgDude, { frameWidth: 32, frameHeight: 48 }); //精灵表方式载入精灵图片
    this.load.audio("audioDiamond", ["static/Diamond.mp3"]); //载入精灵碰撞星星的声音
    this.load.audio("audioJump", ["static/Jump.mp3"]); //载入跳跃声音
    this.load.audio("audioDeath", ["static/Death.mp3"]); //载入精灵碰撞炸弹死亡声音
    console.log("读取资源结束");
    console.log(game.config.width);
  },

  create: function () {
    this.input.setDefaultCursor('url(src/assets/images/SC2-cursor.cur), pointer')//默认鼠标指针
    this.add.image(683, 384, "background"); //背景图
    //添加开始游戏按钮，设置事件响应，鼠标移动到上面后改为手形状
    var play=this.add.bitmapText(683-110, 384, "desyrel", "Play").setInteractive({ cursor: 'url(src/assets/images/SC2-hyperlink.cur), pointer' }); 
   

    //单击play 就进入游戏场景
    play.once('pointerup', function () {
        this.scene.start('Game');
    }, this);

    //游戏开始字符加上边框范围显示
    // graphics = this.add.graphics(0, 0);
    // bounds = play.getTextBounds();
    // graphics.lineStyle(1, 0x00FF00, 1.0);
    // graphics.strokeRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height);
   
    keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);//按P键开始游戏

  },

  wake: function () {
    
  },

  update: function () {
    if (keyP.isDown)
    {
        this.scene.switch("Game");
    }

  },
});

//游戏内容
var Game = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function Game() {
    Phaser.Scene.call(this, { key: "Game" });

    this.face;
  },

  preload: function () {},

  create: function () {
    this.input.setDefaultCursor('url(src/assets/images/SC2-cursor.cur), pointer')//默认鼠标指针
    this.add.image(683, 384, "background"); //背景图
    platforms = this.physics.add.staticGroup(); //创建静态物体组件，这里是地面和平台，staticGroup静体组
    platforms.create(683, 717.76, "ground").setScale(3.415).refreshBody(); //地面
    platforms.create(600, 550, "ground");
    platforms.create(200, 450, "ground");
    platforms.create(966, 350, "ground").setScale(2, 1).refreshBody(); //最上面的平台

    player = this.physics.add.sprite(100, 150, "dude"); //创建一个精灵

    audioDiamond = this.sound.add("audioDiamond", { volume: 0.5 }); //创建精灵碰撞星星声音
    audioJump = this.sound.add("audioJump", { volume: 0.5 }); //创建精灵碰撞星星声音
    audioDeath = this.sound.add("audioDeath", { volume: 0.5 }); //创建精灵碰撞星星声音

    player.body.setGravityY(300);
    player.setBounce(0.2); //精灵的弹力值
    player.setCollideWorldBounds(true);

    //向左跑动画
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    //停止跑动的图片
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    //向右跑动画
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    //载入星星，group是动体组
    stars = this.physics.add.group({
      key: "star",
      repeat: 11, //星星数量，会自动创建一个 后重复11次创建，总共会创建12个星星
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    //炸弹
    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, "score:0", {
      fontSize: "32px",
      fill: "#FFF",
    }); //计分初试显示
    this.physics.add.collider(player, platforms); //角色和平台的碰撞
    this.physics.add.collider(stars, platforms); //星星和平台的碰撞
    this.physics.add.collider(bombs, platforms); //炸弹和平台的碰撞

    this.physics.add.overlap(player, stars, collectStar, null, this); //角色和星星的碰撞
    this.physics.add.collider(player, bombs, hitBomb, null, this); //角色和炸弹的碰撞
    cursors = this.input.keyboard.createCursorKeys(); //键盘控制
    ariseBomb(); //掉落一个炸弹
  },
  update: function () {
    if (gameOver) {
      return;
    }

    //左移动
    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    }
    //右移动
    else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    }
    //停止时
    else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }
    //判断上键是否按下，并且检查角色是否在地面
    if (cursors.up.isDown && player.body.touching.down) {
      //跳跃
      player.setVelocityY(-430);
      audioJump.play(); //播放跳跃声音
    }
  },
})

//游戏结束
var GameOver = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameOver ()
    {
        Phaser.Scene.call(this, { key: 'gameover' });
        window.OVER = this;
    },

    create: function ()
    {
        console.log('%c GameOver ', 'background: green; color: white; display: block;');

        this.add.sprite(400, 300, 'ImgGameOver');

        this.add.text(300, 500, 'Game Over - Click to start restart', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerup', function (event) {
            console.log('GameOver');
            console.log(this);
             gameOver = false
            this.scene.start('mainmenu')
          
        }, this);
    }

})

const config = {
  title: "我的Phaser3演示代码x",
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1366,
  height: 768,
  //静态物体属性
  physics: {
    //设置物理模式
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [MainMenu, Game,GameOver],
  //游戏画面显示比例设置
  scale: {
   // mode: Phaser.Scale.FIT, //自动缩放游戏画面
    autoCenter: Phaser.Scale.CENTER_BOTH, //游戏画面居中显示
  },
  //声音配置
  audio: {
    context: audioContext,
  },
};

const game = new Phaser.Game(config);
var platforms; //平台
var player; //精灵
var cursors; //控制
var stars; //星星
var score = 0; //分数
var scoreText; //分数名称
var bombs; //炸弹
var gameOver = false;
var audioDiamond; //精灵碰撞星星的声音
var audioJump; //精灵跳跃声音
var audioDeath; //精灵碰撞炸弹死亡声音
var keyP//开始键
var bounds
var graphics
//精灵和星星碰撞的处理
function collectStar(player, star) {
  star.disableBody(true, true); //角色碰撞星星后 星星为不活动、隐形状态
  score += 10; //吃掉一个星星加10分
  scoreText.setText("Score:" + score);
  audioDiamond.play(); //播放精灵碰撞星星的声音

  //没有星星后投放炸弹
  if (stars.countActive(true) === 0) {
    //  重新激活所有星星
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    ariseBomb(); //掉落一个炸弹
  }
}

//精灵和炸弹碰撞后的处理
function hitBomb(player, bomb) {
  audioDeath.play(); //播放精灵碰撞炸弹死亡的声音
  this.physics.pause(); //游戏停止

  player.setTint(0xff0000); //精灵变为红色

  player.anims.play("turn");
  gameOver = true;
  this.scene.start('gameover');
}

function ariseBomb() {
  //随机掉落一个炸弹，但会避开玩家
  var x =
    player.x < 400
      ? Phaser.Math.Between(400, 1366)
      : Phaser.Math.Between(0, 400);
  var bomb = bombs.create(x, 16, "bomb");
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb.allowGravity = false;
}
