
import ImgBackground from "./assets/images/TempleHallForest.jpg";
import ImgGround from "./assets/images/platform.png";
import ImgStar from "./assets/images/star.png";
import ImgBomb from "./assets/images/bomb.png";
import ImgDude from "./assets/images/dude.png";
import ImgGameOver from "./assets/images/ayu.png";
//预加载游戏资源
var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        console.log("读取资源开始");
        this.load.bitmapFont(
          "desyrel",
          "src/assets/fonts/font.png",
          "src/assets/fonts/font.xml"
        ); //加载字体
         //资源加载要单独出来
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
       // console.log(game.config.width);
    },

    create: function ()
    {
        console.log('%c Preloader ', 'background: green; color: white; display: block;');

        this.scene.start('mainmenu');
    }

})



export {Preloader}