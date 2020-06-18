
import ImgBackground from "./assets/images/TempleHallForest.jpg"
import ImgGround from "./assets/images/platform.png"
import ImgBeam from "./assets/images/Beam.png"
import ImgStar from "./assets/images/star.png"
import ImgBomb from "./assets/images/bomb.png"
import ImgDude from "./assets/images/dude.png"
import ImgGameOver from "./assets/images/ayu.png"
import FontCommonPng from "./assets/fonts/font.png"
import FontCommonXml from "./assets/fonts/font.xml"
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
       
        var progress = this.add.graphics();

        this.load.on('progress', function (value) {
            console.log(value)
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 384, 1366 * value, 60);
    
        });
    
        this.load.on('complete', function () {
    
            progress.destroy();
    
        });
       
       
        console.log("读取资源开始");
        this.load.bitmapFont("desyrel",FontCommonPng,FontCommonXml); //加载字体
        this.load.image("background", ImgBackground); //背景图
        this.load.image("ImgBeam", ImgBeam); //菜单界面的光束
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