import Phaser from "phaser";

import backgroundj from "./assets/bg_layer1.png"; //游戏背景图片
import platform from "./assets/ground_grass.png"; //平台图片
import bunnystand from "./assets/bunny1_stand.png"; //兔子站立图片
import bunnyjump  from "./assets/bunny1_jump.png"; //兔子跳跃图片
import carrot from './assets/carrot.png'//胡萝卜


import Carrot from '../game/Carrot.js'


export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player; //兔子角色属性

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms; //平台属性

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors //键盘

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots //胡萝卜

  carrotsCollected = 0//收集胡萝卜的分数
/**@type{Phaser.GameObjects.Text} */
  carrotsCollectedText

  constructor() {
    super("jumperGame");
  
  }

  init(){

    this.carrotsCollected=0
  }
  preload() {
    
    this.load.image("backgroundj", backgroundj)
    this.load.image("platform", platform)
    this.load.image("bunnystand", bunnystand)
    this.load.image("bunnyjump", bunnyjump)
    this.load.image('carrot', carrot)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.load.audio('jump', 'static/sfx/phaseJump1.ogg')
  }

  create() {
    
    this.add.image(240, 320, "backgroundj")
      .setScrollFactor(1, 0)//通过将y滚动因子设置为0，我们可以保持背景不随相机上下滚动。 
    //创建一个有物理树形平台组
    this.platforms = this.physics.add.staticGroup();

    //从组中随机创建5个平台
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400); //平台X方向位置，80至400之间的一个随机位置
      const y = 150 * i; //平台的Y 方向 150 放在一个
      /**@type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.5;

      /**@type (Phaser.Physics.Arcade.StaticBody) */
      platform.body.updateFromGameObject(); //物理大小与图片大小一样（将静态实体的位置和大小与其父级游戏对象同步）
    }

    this.player = this.physics.add.sprite(240, 320, "bunnystand").setScale(0.5); //创建一个有物理属性的兔子
    this.physics.add.collider(this.platforms, this.player); //兔子与平台发生碰撞，兔子不会掉落到游戏窗口外面
    this.player.body.checkCollision.up = false; //关闭上方的物理
    this.player.body.checkCollision.left = false; //关闭左边的物理
    this.player.body.checkCollision.right = false; //关闭右边的物理

    this.cameras.main.startFollow(this.player); //镜头一直跟随兔子
    //使游戏不再左右滚动
    this.cameras.main.setDeadzone(this.scale.width * 1.5) // 左右移动时相机镜头不移动,将水平死区设置为1.5倍游戏宽度
    //含物理属性的胡萝卜组
    this.carrots = this.physics.add.group({
      classType: Carrot
    })
    // this.carrots.get(240,320,'carrot') //放置一个胡萝卜 测试代码 可删除
    //添加平台与胡萝卜的碰撞 
    this.physics.add.collider(this.platforms, this.carrots)
    // 收集胡萝卜
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot, //当兔子和胡萝卜重叠时会调用这个方法
      undefined,
      this
    )
      //分数显示  setScrollFactor(0)是禁止滚动 setOrigin(0.5,0)保存文本居中 
    const style={color:'#000',fontSize:24}
    this.carrotsCollectedText=this.add.text(240,10,'Carrots：0',style)
    .setScrollFactor(0)
    .setOrigin(0.5,0)
  }

  update() {
    //平台无限滚动重复出现
    this.platforms.children.iterate((child) => {
      //遍历所有平台
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      //检查每个平台的y值是否大于或等于相机滚动的垂直距离加上固定的700像素。
      if (platform.y >= scrollY + 700) {
        //将平台移动到摄像机顶部上方50到100像素之间的某个随机量
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        //我们刷新平台的物理主体以匹配对平台所做的更改，即y的更改
        platform.body.updateFromGameObject();
        //添加胡萝卜到平台上面
        this.addCarrotAbove(platform)

      }
    });

    const touchingDown = this.player.body.touching.down; //在触摸下面的东西
    if (touchingDown) {
      this.player.setVelocityY(-300); //使兔子向上直线跳跃

      this.player.setTexture('bunnyjump')//兔子跳跃动作
      this.sound.play('jump')
    }

    //可以通过访问PLAYER物理身体的速度属性来获得y速度
    const vy=this.player.body.velocity.y
 
    //我们检查它是否大于0，并且玩家的当前纹理还不是“兔子站”。如果是这样，我们将纹理更改回立式图像
    if (vy>50 && this.player.texture.key !='bunnystand')
    {
        this.player.setTexture('bunnystand')
    }

    //如果按下键，则设置 X到达速度 -200左侧和 200为右。 
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200)
    } else {
      //当没有按下任何东西时，我们设置 X到达速度 0停止水平运动。 
      this.player.setVelocityX(0)
    }
    this.horizontalWrap(this.player)

    const bottomPlatform=this.findBottomMostPlatform()
    if(this.player.y > bottomPlatform.y+200)
    {
      console.log('game over')
      this.scene.start('game-over')
    }

  }

  /**
   * 左右环绕移动,超过屏幕时从另外一面出来
   *  如果传入 sprite超过一半宽度的左边，然后传送到一半宽度的右边
   * @param {Phaser.GameObjects.Sprite} sprite 
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    }
    else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }

  }
  /**
   * 
   * @param {Phaser.GameObjects.sprite} sprite 
   */
  addCarrotAbove(sprite) {
    //设置胡萝卜到精灵的上方
    const y = sprite.y - sprite.displayHeight
    /**@type{Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot')
    
    carrot.body.checkCollision.up = false; //关闭上方的物理
    carrot.body.checkCollision.left = false; //关闭左边的物理
    carrot.body.checkCollision.right = false; //关闭右边的物理
    
    //设置为胡萝卜物理可见
    carrot.setActive(true)
    //设置胡萝卜可见
    carrot.setVisible(true)
    
    
    this.add.existing(carrot)
    //将物理主体大小设置为胡萝卜的宽高
    carrot.body.setSize(carrot.width, carrot.height)

  //确保身体在物理世界中启用
    this.physics.world.enable(carrot)
    return carrot

  }

  /**
   * 收集胡萝卜
   * @param {Phaser.physics.Arcade.sprite} player 
   * @param {carrot} carrot 
   */
  handleCollectCarrot(player,carrot){
    //隐藏显示
    this.carrots.killAndHide(carrot)
    //从物理学世界中禁用
    this.physics.world.disableBody(carrot.body)

    //收集一个胡萝卜就加1
    this.carrotsCollected++
    const value=`Carrots：${this.carrotsCollected}`
    this.carrotsCollectedText.text=value

  }

  //查找平台底部
  findBottomMostPlatform()
  {
    //将所有平台作为一个数组获取 
    const platforms=this.platforms.getChildren()
   //选择Array中的第一个作为当前最底部的平台
    let bottomPlatform=platforms[0]
    //对数组进行循环，并比较当前底部bottomform中的每个平台。 如果一个平台的y位置大于底部平台，然后我们将其设置为新底部平台
    for(let i=1;i<platforms.length;++i){
      const platform=platforms[i]
    

        if(platform.y < bottomPlatform.y)
            {
              
            continue
          }
      bottomPlatform=platform


     }
    //一旦遍历整个数组，最后一个存储在底部平台上的平台就是底部
 
    return bottomPlatform
  }

}
