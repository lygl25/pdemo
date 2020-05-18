
var bounds //play 字符调试用的边框
var graphics//play 字符调试用的边框显示
var keyP//开始键


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
      this.input.setDefaultCursor('url(src/assets/images/SC2-cursor.cur), pointer')//默认鼠标指针
      this.add.image(683, 384, "background"); //背景图
      //添加开始游戏按钮，设置事件响应，鼠标移动到上面后改为手形状
      var play=this.add.bitmapText(683-110, 384, "desyrel", "Play").setInteractive({ cursor: 'url(src/assets/images/SC2-hyperlink.cur), pointer' }); 
     
  
      //单击play 就进入游戏场景
      play.once('pointerup', function () {
        startGame(this)
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
        startGame(this)
      }
  
    },
  })

   //开始游戏
  function startGame(obj){
    obj.scene.start('Game');

  }

  export {MainMenu}
  