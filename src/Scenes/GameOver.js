import Phaser from 'phaser'


export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('game-over')
    }

    

    create()
    {

            
  
        const width=this.scale.width
        const height=this.scale.height
            console.log()
        this.add.text(width*0.5,height*0.5,'Game over',{
            fontSize:"48px",
            fill: "#FFFFFF",
        }).setOrigin(0.5)//并将原点设置为0.5，以使其在垂直和水平方向上居中

        this.input.keyboard.once('keydown_SPACE',()=>{
            this.scene.start('mainmenu')
         
    })


    }

}