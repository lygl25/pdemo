import items from "./img/items.png";
import player from "./img/player.png";
import secret from "./img/secret.png";
import tiles from "./img/tiles.png";

var play; //精灵
var platforms; //平台

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
    this.load.spritesheet('player', player,{frameWidth:16,frameHeight:16});

    
  },

  create: function () {
  //  this.camera.flash(0x000000, 250);
    
    //制作地图数据
    var map = this.make.tilemap({ key: "map" });
    //加入瓦片地图的背景图片 stageTiles 是图块集名字，tiles 是对应的图片
    var tiles = map.addTilesetImage("stageTiles", "tiles");


    map.createDynamicLayer("backgroundLayer", tiles, 0, 0);
    map.createDynamicLayer("stageLayer", tiles, 0, 0);
    map.createDynamicLayer("trapsLayer", tiles, 0, 0);
    
    platforms = this.physics.add.staticGroup(); //创建静态物体组件，这里是地面和平台，staticGroup静体组

    play = this.physics.add.sprite(43,407, "player"); //创建一个精灵
    this.physics.add.collider(play, platforms); //角色和平台的碰撞
  },
  update: function () {},

  // 每次调用场景SceneA会执行一次;
  init: function () {}, 
});

export { play };
