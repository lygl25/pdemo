
import Phaser from "phaser";
import gc from "./gameconfig" //游戏配置
import {Preloader} from "./preloader" //游戏资源预加载
import {Game} from "./game"   //游戏内容
import {MainMenu} from "./mainmenu"   //游戏开始菜单场景
import {GameOver} from "./gameover"   //游戏结束菜单场景
import jumpergame from "./Scenes/Game"   //无限跳跃游戏场景
import jumperGameOver from './Scenes/GameOver' //无限跳跃游戏结束
import {play} from './pixelgames/play' //像素游戏


console.dir(Phaser)
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
  width: gc.width,
  height: gc.height,
  //静态物体属性
  physics: {
    //设置街机物理模式
    default: "arcade",
    arcade: {
      gravity: { y: 0 },//引力
      debug: true,
    },
  },
  scene: [play,Preloader,MainMenu, Game,GameOver,jumpergame,jumperGameOver],
  //游戏画面显示比例设置
  scale: {
    mode: Phaser.Scale.FIT, //自动缩放游戏画面
    autoCenter: Phaser.Scale.CENTER_BOTH, //游戏画面居中显示

  },
  //声音配置
  audio: {
    context: audioContext,
  },
};



const game = new Phaser.Game(config);

