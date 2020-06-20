import items from "./img/items.png";
import player from "./img/player.png";
import secret from "./img/secret.png";
import tiles from "./img/tiles.png";

var play; //精灵
var playturn = 0// 精灵停止后面朝方向 0 右边  1左边
var cursors; //键盘控制

//游戏内容
var play = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function Game() {
    Phaser.Scene.call(this, { key: "pixelgames" });
  },

  preload: function () {
    //加载tilemap地图json文件
    this.load.tilemapTiledJSON("map", "static/tilemaps/1.json");

    //加载tilemap地图图片文件
    this.load.image("tiles", tiles);

    //加载角色图片
    this.load.spritesheet('player', player, { frameWidth: 16, frameHeight: 16 });


  },

  create: function () {

    var cam = this.cameras.main;


    //淡入淡出效果（持续时间，R，G，B）
    cam.flash(250, 30, 100, 100);

    //制作地图数据
    var map = this.make.tilemap({ key: "map" });
    //加入瓦片地图的背景图片 stageTiles 是图块集名字，tiles 是对应的图片
    var tiles = map.addTilesetImage("stageTiles", "tiles");


    map.createDynamicLayer("backgroundLayer", tiles, 0, 0);
    const stageLayer=map.createDynamicLayer("stageLayer", tiles, 0, 0);
    const trapsLayer=map.createDynamicLayer("trapsLayer", tiles, 0, 0);
    map.setCollisionBetween(1, 2000, true,true, 'trapsLayer');
    map.setCollisionBetween(1, 2000, true,true, 'stageLayer');
   


    
    

    play = this.physics.add.sprite(43, 407, "player"); //创建一个精灵
     this.physics.add.collider(trapsLayer, play)
     this.physics.add.collider(stageLayer, play)
     
    cursors = this.input.keyboard.createCursorKeys() //开启键盘控制

    //向右跑动画
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,//帧速率
      repeat: -1,//重复播放
    });

    //向右跑动画
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
      frameRate: 10,//帧速率
      repeat: -1,//重复播放
    });

    //停止跑动右转的图片
    this.anims.create({
      key: "rightturn",
      frames: [{ key: "player", frame: 5 }],
      frameRate: 20,
    });

    //停止跑动左转的图片
    this.anims.create({
      key: "leftturn",
      frames: [{ key: "player", frame: 14 }],
      frameRate: 20,
    });
      //设置角色在镜头中心
    cam.startFollow(play)
    //设置角色在镜头的边界
    cam.setBounds(0,0,map.widthInPixels,map.heightInPixels)


  },
  update: function () {
    play.body.setVelocityX(0);
    //最后一帧的速度克隆
    const prevVelocity = play.body.velocity.clone()

    //上下左右移动
    if (cursors.left.isDown) {
      // play.body.setVelocityX(-100)
      playturn = 1
      play.body.setVelocityX(-100)
      play.anims.play("left", true);

    } else if (cursors.right.isDown) {

      playturn = 0
      play.body.setVelocityX(100)
      play.anims.play("right", true);

    } else if (cursors.up.isDown ) {
      play.body.setVelocityY(-100)
    } else if (cursors.down.isDown) {
       play.body.setVelocityY(100)
    } else {
      //没有按键就停止移动
      if (playturn === 0) {

        play.anims.play("rightturn");
      } else {
        play.anims.play("leftturn");
      }

      //play.anims.stop()



    }

  },

  // 每次调用场景SceneA会执行一次;
  init: function () { },



});

export { play };
