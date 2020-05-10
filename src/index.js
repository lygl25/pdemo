import Phaser from "phaser";


const config = {
  title:"我的Phaser3演示代码x",
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1366,
  height: 768,
  scene: {
    preload: preload,
    create: create,
    update:update
  }
};
  
const game = new Phaser.Game(config);

function preload() {

}


function create() {

}

function update(){
}
