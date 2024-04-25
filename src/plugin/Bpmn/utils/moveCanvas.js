
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas/MoveCanvas';

MoveCanvasModule.prototype.handleMove = () => {} // 只要原型链上这个方法为空即可，方法有很多。

export default {
  __init__: ['moveCanvas'],
  zoomScroll: ['type', MoveCanvasModule]
}