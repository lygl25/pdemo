import gc from "./gameconfig"

var bounds //play 字符调试用的边框
var graphics//play 字符调试用的边框显示
var keyP//开始键
var objects = {} //光束动画
var direction=1//光束旋转方向  =1正方向 =0 负方向

//游戏开始菜单
var MainMenu = new Phaser.Class({
    Extends: Phaser.Scene,
  
    initialize: function Game() {
      Phaser.Scene.call(this, "mainmenu");
  
      this.pic;
    }, 
    
    preload: function () {
    
    },
  
    create: function () {
      this.input.setDefaultCursor(gc.cursorDef)//默认鼠标指针
      this.add.image(gc.width/2, gc.height/2, "background"); //背景图
      objects.image0 = this.add.image(gc.width/2,-10, "ImgBeam"); //光束
      objects.image1 =this.add.image(gc.width/2, -10, "ImgBeam"); //光束
      objects.image0._displayOriginY=0//修改光束的原点
      objects.image1._displayOriginY=0//修改光束的原点
  
      console.log(objects.image0)

      //添加开始游戏按钮，设置事件响应，鼠标移动到上面后改为手形状
      var play=this.add.bitmapText(gc.width/2-110, gc.height/2, "desyrel", "Play1").setInteractive({ cursor: gc.cursorHand }); 
 
      var play2=this.add.bitmapText(gc.width/2-110, gc.height/2+100, "desyrel", "Play2").setInteractive({ cursor: gc.cursorHand }); 
  
      //单击play 就进入游戏场景
      play.once('pointerup', function () {
        startGame(this,'Game')
      }, this);

      play2.once('pointerup', function () {
        startGame(this,'jumperGame')
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
        startGame(this,'Game')
      }
      if (direction==1 ){
        objects.image0.rotation += 0.01
        objects.image1.rotation += 0.02
        if (objects.image0.rotation>0.3){
          direction=0
        }
      }else{
        objects.image0.rotation -= 0.01;  
        objects.image1.rotation -= 0.02;  
        if (objects.image0.rotation<-0.3){
          direction=1
        }
      }
      
    },
  })

   //开始游戏
  function startGame(obj,scenes){
    obj.scene.start(scenes);

  }

  export {MainMenu}
  