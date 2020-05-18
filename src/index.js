
import Phaser from "phaser";
import {Preloader} from "./preloader" //游戏资源预加载
import {Game} from "./game"   //游戏内容
import {MainMenu} from "./mainmenu"   //游戏菜单
import {GameOver} from "./gameover"   //游戏菜单



// 使用 Web Audio API
var audioContext;
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.error(e);
}

const config = {
  title: "我的Phaser3演示代码x",
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1366,
  height: 768,
  //静态物体属性
  physics: {
    //设置物理模式
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Preloader,MainMenu, Game,GameOver],
  //游戏画面显示比例设置
  scale: {
   // mode: Phaser.Scale.FIT, //自动缩放游戏画面
    autoCenter: Phaser.Scale.CENTER_BOTH, //游戏画面居中显示
  },
  //声音配置
  audio: {
    context: audioContext,
  },
};



const game = new Phaser.Game(config);

