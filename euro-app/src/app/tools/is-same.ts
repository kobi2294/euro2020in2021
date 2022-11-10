import { UrlTree } from '@angular/router';

export function isSame(a1: any, a2: any): boolean {
  if (a1 instanceof UrlTree) a1 = a1.toString();
  if (a2 instanceof UrlTree) a2 = a2.toString();

  // console.log('is same', a1, a2);
  if (a1 === a2) {
    // console.log('identical, true', a1, a2);
    return true;
  }

  if (typeof a1 !== typeof a2) {
    // console.log('different type, false', a1, a2);
    return false;
  }

  if (a1 instanceof Array && a2 instanceof Array) {
    if (a1.length !== a2.length) {
      // console.log('arrays of different length, false', a1, a2);
      return false;
    }
    const res = a1.every((item, index) => isSame(item, a2[index]));
    // console.log('arrays compared', res, a1, a2);
    return res;
  }

  // console.log('cant handle this, false', a1, a2);
  return false;
}
