import gc from "./gameconfig"

var audioJump; //精灵跳跃声音
var audioDiamond; //精灵碰撞星星的声音
var audioDeath; //精灵碰撞炸弹死亡声音
var player; //精灵
var platforms; //平台
var stars; //星星
var bombs; //炸弹
var cursors; //控制
var scoreText; //分数名称
var score = 0; //分数

//游戏内容
var Game = new Phaser.Class({
    Extends: Phaser.Scene,
  
    initialize: function Game() {
      Phaser.Scene.call(this, { key: "Game" });
  
      this.face;
    },
  
    preload: function () {},
  
    create: function () {
   
      this.input.setDefaultCursor(gc.cursorDef)//默认鼠标指针
      this.add.image(gc.width/2,gc.height/2, "background"); //背景图
      platforms = this.physics.add.staticGroup(); //创建静态物体组件，这里是地面和平台，staticGroup静体组
      platforms.create(gc.width/2, gc.height*0.9345833, "ground").setScale(3.415).refreshBody(); //地面
      platforms.create(gc.width*0.43923, gc.height*0.7161, "ground");//中间平台下
      platforms.create(gc.width*0.1464,gc.height*0.58, "ground");//中间平台下
      platforms.create(gc.width*0.7071,gc.height*0.4 , "ground").setScale(2, 1).refreshBody(); //最上面的平台
      this.data.set('score', 0);
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
    // 每次调用场景SceneA会执行一次;
    init: function () {
      score = 0//分数清零
    }

  })


  //获取分数，精灵和星星碰撞的处理
function collectStar(player,star) {
    star.disableBody(true, true); //角色碰撞星星后 星星为不活动、隐形状态
    score += 10; //吃掉一个星星加10分
    scoreText.setText("Score:" + score)//游戏画面显示当前分数
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

  // 游戏失败，精灵和炸弹碰撞后的处理
function hitBomb(player, bomb) {
    audioDeath.play(); //播放精灵碰撞炸弹死亡的声音
    this.physics.pause(); //游戏停止
    player.setTint(0xff0000); //精灵变为红色
    player.anims.play("turn");
 
    this.scene.start('gameover',{score});
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
  

  export {Game}