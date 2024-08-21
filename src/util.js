import { REACT_TEXT } from './constant';

/**
 * 判断一个值是不是未定义的,也就是 null和 undefined
 * @param {*} val
 * @returns
 */
export function isUndefiend(val) {
  return val === undefined || val === null;
}

/**
 * 判断一个值是不是定义的,也就是不是 null 并且不是 undefiend
 * @param {*} val
 * @returns
 */
export function isDefined(val) {
  return val !== undefined && val !== null;
}

/**
 * 为了更加语义化,我们把文本节点包装成 vdom
 * @param {*} element
 */
export function wrapToVdom(element) {
  return typeof element === 'string' || typeof element === 'number'
    ? {
        type: REACT_TEXT,
        props: element,
      }
    : element;
}

/**
 * 把任意的一个值包装成一个数组
 * 如果是多维数组的话要打成一维数组
 * @param {*} val
 * @returns
 */
export function wrapToArray(val) {
  return Array.isArray(val) ? val.flat() : [val];
}
