//游戏结束
var GameOver = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameOver ()
    {
        Phaser.Scene.call(this, { 
            key: 'gameover' ,
        });
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
         
            this.scene.start('mainmenu')
          
        }, this);
    },
    init: function (data) {
        //方法1. 引入sceneA 在初始化的时候就可以获得场景Scene传递的值;
        console.log(data)
        this.Game = this.scene.get('Game'); // sceneA's key
        var text = this.add.text(20, 20, '', { font: '32px Courier', fill: '#00ff00' });
        text.setText([
            '得分Score: ' +data.score
        ]);
        console.log("get data from sceneA:",data.score);
    }

})

export{GameOver}