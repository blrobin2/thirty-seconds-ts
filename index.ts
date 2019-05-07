type Mapper<T, U> = (x: T, i?: number, a?: T[]) => U;
type Filterer<T> = Mapper<T, boolean>;
type Reducer<T, U> = (acc: U, x: T, i?: number, r?: T[]) => U;
type Callback<T> = Mapper<T, void>;
type Comparator<T, U> = (a: T, b: T, i?: number, j?: number) => U;
interface IObject<T> {
  [key: string]: T;
}

// https://30secondsofcode.org/#all
const all = <T>(arr: T[], fn: Filterer<T> = Boolean): boolean => arr.every(fn);
all([4, 2, 3], (x) => x > 1); // true
all([1, 2, 3]); // true

// https://30secondsofcode.org/#allequal
const allEqual = <T>(arr: T[]): boolean => arr.every((val) => val === arr[0]);
allEqual([1, 2, 3, 4, 5, 6]); // false
allEqual([1, 1, 1, 1]); // true

// https://30secondsofcode.org/#any
const anyValue = <T>(arr: T[], fn: Filterer<T> = Boolean): boolean =>
  arr.some(fn);
anyValue([0, 1, 2, 0], (x) => x >= 2); // true
anyValue([0, 0, 1, 0]); // true

// https://30secondsofcode.org/#arraytocsv
const arrayToCSV = (arr: any[][], delimter = ","): string =>
  arr
    .map((v) =>
      v.map((x) => (isNaN(x) ? `"${x.replace(/"/g, '""')}` : x)).join(delimter),
    )
    .join("\n");
arrayToCSV([["a", "b"], ["c", "d"]]); // '"a","b"\n"c","d"'
arrayToCSV([["a", "b"], ["c", "d"]], ";"); // '"a";"b"\n"c";"d"'
arrayToCSV([["a", '"b" great'], ["c", 3.1415]]); // '"a","""b"" great"\n"c",3.1415'

// https://30secondsofcode.org/#bifurcate
const bifurcate = <T>(arr: T[], filter: any[]): T[][] =>
  arr.reduce(
    (acc: T[][], val: T, i: number) => (
      acc[!!filter[i] ? 0 : 1].push(val), acc
    ),
    [[], []],
  );
bifurcate(["beep", "boop", "foo", "bar"], [true, true, false, true]); // [ ['beep', 'boop', 'bar'], ['foo'] ]

// https://30secondsofcode.org/#bifurcateby
const bifurcateBy = <T>(arr: T[], fn: Filterer<T>): T[][] =>
  arr.reduce(
    (acc: T[][], val: T, i: number) => (acc[fn(val, i) ? 0 : 1].push(val), acc),
    [[], []],
  );
bifurcateBy(["beep", "boop", "foo", "bar"], (x) => x[0] === "b"); // [ ['beep', 'boop', 'bar'], ['foo'] ]

// https://30secondsofcode.org/#chunk
const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i: number) =>
    arr.slice(i * size, i * size + size),
  );
chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]

// https://30secondsofcode.org/#compact
const compact = (arr: any[]): any[] => arr.filter(Boolean);
compact([0, 1, false, 2, "", 3, "a", "e", 23, NaN, "s", 34]); // [ 1, 2, 3, 'a', 's', 34 ]

// https://30secondsofcode.org/#countby
const countBy = <T>(
  arr: T[],
  fn: Mapper<T, string | number>,
): IObject<number> =>
  arr.map(fn).reduce((acc: IObject<number>, val: string | number) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
countBy([6.1, 4.2, 6.3], Math.floor); // {4: 1, 6: 2}
countBy(["one", "two", "three"], (x) => x.length); // {3: 2, 5: 1}

// https://30secondsofcode.org/#countoccurrences
const countOccurrences = <T>(arr: T[], val: T): number =>
  arr.reduce((acc: number, v: T) => (v === val ? acc + 1 : acc), 0);
countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3

// https://30secondsofcode.org/#difference
const difference = <T>(a: T[], b: T[]): T[] => {
  const s: Set<T> = new Set(b);
  return a.filter((x: T) => !s.has(x));
};
difference([1, 2, 3], [1, 2, 4]); // [3]

// https://30secondsofcode.org/#differenceby
const differenceBy = <T, U>(a: T[], b: T[], fn: Mapper<T, U>): U[] => {
  const s: Set<U> = new Set(b.map(fn));
  return a.map(fn).filter((x: U) => !s.has(x));
};
differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [1]
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], (v) => v.x); // [2]

// https://30secondsofcode.org/#differencewith
const differenceWith = <T>(
  arr: T[],
  val: T[],
  comp: Comparator<T, boolean>,
): T[] => arr.filter((a: T) => val.findIndex((b: T) => comp(a, b)) === -1);
differenceWith(
  [1, 1.2, 1.5, 3, 0],
  [1.9, 3, 0],
  (a, b) => Math.round(a) === Math.round(b),
); // [1, 1.2]

// https://30secondsofcode.org/#drop
const drop = <T>(arr: T[], n: number = 1): T[] => arr.slice(n);
drop([1, 2, 3]); // [2,3]
drop([1, 2, 3], 2); // [3]
drop([1, 2, 3], 42); // []

// https://30secondsofcode.org/#dropright
const dropRight = <T>(arr: T[], n: number = 1): T[] => arr.slice(0, -n);
dropRight([1, 2, 3]); // [1,2]
dropRight([1, 2, 3], 2); // [1]
dropRight([1, 2, 3], 42); // []

// https://30secondsofcode.org/#droprightwhile
const dropRightWhile = <T>([...arr]: T[], fn: Filterer<T>): T[] => {
  while (arr.length > 0 && !fn(arr[arr.length - 1])) {
    arr = arr.slice(0, -1);
  }
  return arr;
};
dropRightWhile([1, 2, 3, 4], (n: number) => n < 3); // [1, 2]

// https://30secondsofcode.org/#dropwhile
const dropWhile = <T>([...arr]: T[], fn: Filterer<T>): T[] => {
  while (arr.length > 0 && !fn(arr[0])) {
    arr = arr.slice(1);
  }
  return arr;
};
dropWhile([1, 2, 3, 4], (n: number) => n >= 3); // [3,4]

// https://30secondsofcode.org/#everynth
const everyNth = <T>(arr: T[], nth: number): T[] =>
  arr.filter((_, i: number) => i % nth === nth - 1);
everyNth([1, 2, 3, 4, 5, 6], 2); // [ 2, 4, 6 ]

// https://30secondsofcode.org/#filterfalsy
const filterFalsy = compact;
filterFalsy(["", true, {}, false, "sample", 1, 0]); // [true, {}, 'sample', 1]

// https://30secondsofcode.org/#filternonunique
const filterNonUnique = <T>(arr: T[]): T[] =>
  arr.filter((v: T) => arr.indexOf(v) === arr.lastIndexOf(v));
filterNonUnique([1, 2, 2, 3, 4, 4, 5]); // [1, 3, 5]

// https://30secondsofcode.org/#filternonuniqueby
const filterNonUniqueBy = <T>(arr: T[], fn: Comparator<T, boolean>): T[] =>
  arr.filter((v: T, i: number) =>
    arr.every((x: T, j: number) => i === j && fn(v, x, i, j)),
  );
filterNonUniqueBy(
  [
    { id: 0, value: "a" },
    { id: 1, value: "b" },
    { id: 2, value: "c" },
    { id: 1, value: "d" },
    { id: 0, value: "e" },
  ],
  (a, b) => a.id === b.id,
); // [ { id: 2, value: 'c' } ]

// https://30secondsofcode.org/#findlast
const findLast = <T>(arr: T[], fn: Filterer<T>): T | undefined =>
  arr.filter(fn).pop();
findLast([1, 2, 3, 4], (n: number) => n % 2 === 1);

// https://30secondsofcode.org/#findlastindex
const findLastIndex = <T>(arr: T[], fn: Filterer<T>): number => {
  const lastPair: [number, T] | undefined = arr
    .map((val: T, i: number): [number, T] => [i, val])
    .filter(([i, val]: [number, T]) => fn(val, i, arr))
    .pop();
  if (!lastPair) {
    return -1;
  }
  return lastPair[0];
};
findLastIndex([1, 2, 3, 4], (n: number) => n % 2 === 1);

// https://30secondsofcode.org/#foreachright
const forEachRight = <T>(arr: T[], callback: Callback<T>): void =>
  arr
    .slice(0)
    .reverse()
    .forEach(callback);
// tslint:disable-next-line:no-console
forEachRight([1, 2, 3, 4], (val) => console.log(val));

// https://30secondsofcode.org/#groupby
const groupBy = <T>(arr: T[], fn: Mapper<T, string | number>): IObject<T[]> =>
  arr.map(fn).reduce((acc: IObject<T[]>, val: string | number, i: number) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});
groupBy([6.1, 4.2, 6.3], Math.floor); // {4: [4.2], 6: [6.1, 6.3]}
groupBy(["one", "two", "three"], (x) => x.length); // {3: ['one', 'two'], 5: ['three']}

// https://30secondsofcode.org/#head
const head = <T>(arr: T[]): T | undefined => arr[0];
head([1, 2, 3]); // 1

// https://30secondsofcode.org/#indexofall
const indexOfAll = <T>(arr: T[], val: T): number[] =>
  arr.reduce(
    (acc: number[], el: T, i: number) => (el === val ? [...acc, i] : acc),
    [],
  );
indexOfAll([1, 2, 3, 1, 2, 3], 1); // [0,3]
indexOfAll([1, 2, 3], 4); // []

// https://30secondsofcode.org/#initial
const initial = <T>(arr: T[]): T[] => arr.slice(0, -1);
initial([1, 2, 3]); // [1,2]

// https://30secondsofcode.org/#initialize2darray
const initialize2DArray = <T>(
  w: number,
  h: number,
  val?: T,
): Array<Array<T | {}>> => {
  const wMapper = () =>
    val ? Array.from({ length: w }).fill(val) : Array.from({ length: w });
  return Array.from({ length: h }).map(wMapper);
};
initialize2DArray(2, 2, 0); // [[0,0], [0,0]]

// https://30secondsofcode.org/#initializearraywithrange
const initializeArrayWithRange = (end: number, start = 0, step = 1): number[] =>
  Array.from(
    { length: Math.ceil((end - start + 1) / step) },
    (_, i: number) => i * step + start,
  );
initializeArrayWithRange(5); // [0,1,2,3,4,5]
initializeArrayWithRange(7, 3); // [3,4,5,6,7]
initializeArrayWithRange(9, 0, 2); // [0,2,4,6,8]

// https://30secondsofcode.org/#initializearraywithrangeright
const initializeArrayWithRangeRight = (
  end: number,
  start = 0,
  step = 1,
): number[] =>
  Array.from({ length: Math.ceil((end + 1 - start) / step) }).map(
    (_, i: number, arr: Array<{}>) => (arr.length - i - 1) * step + start,
  );
initializeArrayWithRangeRight(5); // [5,4,3,2,1,0]
initializeArrayWithRangeRight(7, 3); // [7,6,5,4,3]
initializeArrayWithRangeRight(9, 0, 2); // [8,6,4,2,0]

// https://30secondsofcode.org/#initializearraywithvalues
const initializeArrayWithValues = <T>(
  n: number,
  val: T | number = 0,
): Array<T | number> => Array(n).fill(val);
initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2]

// https://30secondsofcode.org/#intersection
const intersection = <T>(a: T[], b: T[]): T[] => {
  const s = new Set(b);
  return a.filter((x: T) => s.has(x));
};
intersection([1, 2, 3], [4, 3, 2]); // [2, 3]

// https://30secondsofcode.org/#intersection
const intersectionBy = <T, U>(a: T[], b: T[], fn: Mapper<T, U>): T[] => {
  const s = new Set(b.map(fn));
  return a.filter((x: T) => s.has(fn(x)));
};
intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [2.1]

// https://30secondsofcode.org/#intersectionwith
const intersectionWith = <T>(
  a: T[],
  b: T[],
  comp: Comparator<T, boolean>,
): T[] => a.filter((x: T) => b.findIndex((y: T) => comp(x, y)) !== -1);
intersectionWith(
  [1, 1.2, 1.5, 3, 0],
  [1.9, 3, 0, 3.9],
  (a, b) => Math.round(a) === Math.round(b),
); // [1.5, 3, 0]

// https://30secondsofcode.org/#issorted
// 1. isSorted is something that should return a boolean, not a number, so changed name
// 2. The function only returned -1|0|1 if the values were sequential
//    I've updated the function to return -1|0|1 for ranges of variable steps
const sortedDirection = (arr: number[]): number => {
  let direction = -(arr[0] - arr[1]);
  for (const [i, val] of arr.entries()) {
    direction = !direction ? -(arr[i - 1] - arr[i]) : direction;
    if (i === arr.length - 1) {
      if (!direction) {
        return 0;
      }
      return direction > 0 ? 1 : direction / -direction;
    } else if ((val - arr[i + 1]) * direction > 0) {
      return 0;
    }
  }
  return 0;
};
sortedDirection([0, 1, 2, 2]); // 1
sortedDirection([4, 3, 2]); // -1
sortedDirection([4, 3, 5]); // 0
sortedDirection([1, 10, 12, 30]); // 1
sortedDirection([29, 17, 2, 1]); // -1

// https://30secondsofcode.org/#join
const join = <T>(arr: T[], separator = ",", end = separator): string =>
  arr.reduce(
    (acc: string, val: T, i: number) =>
      i === arr.length - 2
        ? acc + val + end
        : i === arr.length - 1
          ? acc + val
          : acc + val + separator,
    "",
  );
join(["pen", "pineapple", "apple", "pen"], ", ", "&"); // "pen,pineapple,apple&pen"
join(["pen", "pineapple", "apple", "pen"], ","); // "pen,pineapple,apple,pen"
join(["pen", "pineapple", "apple", "pen"]); // "pen,pineapple,apple,pen"

// https://30secondsofcode.org/#jsontocsv
const jsonToCsv = (
  arr: Array<IObject<any>>,
  columns: string[],
  delimeter = ",",
): string =>
  [
    columns.join(delimeter),
    ...arr.map((obj) =>
      columns.reduce(
        (acc: string, key: string) =>
          `${acc}${!acc.length ? "" : delimeter}"${!obj[key] ? "" : obj[key]}"`,
        "",
      ),
    ),
  ].join("\n");
jsonToCsv(
  [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }],
  ["a", "b"],
); // 'a,b\n"1","2"\n"3","4"\n"6",""\n"","7"'
jsonToCsv(
  [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }],
  ["a", "b"],
  ";",
); // 'a;b\n"1";"2"\n"3";"4"\n"6";""\n"";"7"'

// https://30secondsofcode.org/#last
const last = <T>(arr: T[]): T => arr[arr.length - 1];
last([1, 2, 3]); // 3

// https://30secondsofcode.org/#longestitem
const longestItem = (...vals: Array<{ length: number }>): { length: number } =>
  vals.reduce((a, x) => (x.length > a.length ? x : a));
longestItem("this", "is", "a", "testcase"); // 'testcase'
longestItem(...["a", "ab", "abc"]); // 'abc'
longestItem(...["a", "ab", "abc"], "abcd"); // 'abcd'
longestItem([1, 2, 3], [1, 2], [1, 2, 3, 4, 5]); // [1, 2, 3, 4, 5]
longestItem([1, 2, 3], "foobar"); // 'foobar'

// https://30secondsofcode.org/#mapobject
const mapObject = <T extends { toString: () => string }, U>(
  arr: T[],
  fn: Mapper<T, U>,
): IObject<U> => {
  const mapped: U[] = arr.map(fn);
  return arr.reduce((acc: IObject<U>, val: T, i: number) => {
    acc[val.toString()] = mapped[i];
    return acc;
  }, {});
};
mapObject([1, 2, 3], (a: number) => a * a); // { 1: 1, 2: 4, 3: 9 }

// https://30secondsofcode.org/#maxn
const maxN = (arr: number[], n = 1): number[] =>
  [...arr].sort((a, b) => b - a).slice(0, n);
maxN([1, 2, 3]); // [3]
maxN([1, 2, 3], 2); // [3,2]

// https://30secondsofcode.org/#minn
const minN = (arr: number[], n = 1): number[] =>
  [...arr].sort((a, b) => a - b).slice(0, n);
minN([1, 2, 3]); // [1]
minN([1, 2, 3], 2); // [1,2]

// https://30secondsofcode.org/#none
const none = <T>(arr: T[], fn: Filterer<T> = Boolean): boolean => !arr.some(fn);
none([0, 1, 3, 0], (x: number) => x === 2); // true
none([0, 0, 0]); // true

// https://30secondsofcode.org/#nthelement
const nthElement = <T>(arr: T[], n = 0): T | undefined =>
  (n === -1 ? arr.slice(n) : arr.slice(n, n + 1))[0];
nthElement(["a", "b", "c"], 1); // 'b'
nthElement(["a", "b", "b"], -3); // 'a'

// https://30secondsofcode.org/#offset
const offset = <T>(arr: T[], off: number): T[] => [
  ...arr.slice(off),
  ...arr.slice(0, off),
];
offset([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
offset([1, 2, 3, 4, 5], -2); // [4, 5, 1, 2, 3]

// https://30secondsofcode.org/#partition
const partition = bifurcateBy;

// https://30secondsofcode.org/#without
const without = <T>(arr: T[], ...args: T[]): T[] =>
  arr.filter((v: T) => !args.includes(v));
without([2, 1, 2, 3], 1, 2); // [3]

// https://30secondsofcode.org/#pull
const pull = <T>(arr: T[], ...args: T[]): void => {
  const pulled = without(arr, ...args);
  arr.length = 0;
  pulled.forEach((v: T) => arr.push(v));
};
let myArray = ["a", "b", "c", "a", "b", "c"];
pull(myArray, "a", "c"); // myArray = [ 'b', 'b' ]

// https://30secondsofcode.org/#pullatindex
const pullAtIndex = <T>(arr: T[], ...indexes: number[]): T[] => {
  const [removed, pulled] = partition(arr, (_, i?: number) =>
    i ? indexes.includes(i) : false,
  );
  arr.length = 0;
  pulled.forEach((v: T) => arr.push(v));
  return removed;
};
myArray = ["a", "b", "c", "d"];
let p = pullAtIndex(myArray, 1, 3); // myArray = [ 'a', 'c' ] , pulled = [ 'b', 'd' ]

// https://30secondsofcode.org/#pullatvalue
const pullAtValue = <T>(arr: T[], ...values: T[]): T[] => {
  const [removed, pulled] = partition(arr, (v: T) => values.includes(v));
  arr.length = 0;
  pulled.forEach((v: T) => arr.push(v));
  return removed;
};
myArray = ["a", "b", "c", "d"];
p = pullAtValue(myArray, "b", "d"); // myArray = [ 'a', 'c' ] , pulled = [ 'b', 'd' ]

// https://30secondsofcode.org/#pullby
const pullBy = <T, U>(arr: T[], toPull: T[], fn: Mapper<T, U>): void => {
  const mapped: U[] = toPull.map(fn);
  const pulled: T[] = arr.filter((v: T) => !mapped.includes(fn(v)));
  arr.length = 0;
  pulled.forEach((v: T) => arr.push(v));
};
let objArray = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }];
pullBy(objArray, [{ x: 1 }, { x: 3 }], (o) => o.x); // myArray = [{ x: 2 }]

// https://30secondsofcode.org/#reducedfilter
const reducedFilter = <T>(
  data: Array<IObject<T>>,
  keys: string[],
  fn: Filterer<IObject<T>>,
): Array<IObject<T>> =>
  data.filter(fn).map((el: IObject<T>) =>
    keys.reduce((acc: IObject<T>, key: string) => {
      acc[key] = el[key];
      return acc;
    }, {}),
  );
const d = [
  {
    age: 24,
    id: 1,
    name: "john",
  },
  {
    age: 50,
    id: 2,
    name: "mike",
  },
];
reducedFilter(d, ["id", "name"], (item) => item.age > 24); // [{ id: 2, name: 'mike'}]

// https://30secondsofcode.org/#reducesuccessive
const reduceSuccessive = <T, U>(arr: T[], fn: Reducer<T, U>, acc: U): U[] =>
  arr.reduce(
    (res: U[], val: T, i: number, a: T[]) => [
      ...res,
      fn(res.slice(-1)[0], val, i, a),
    ],
    [acc],
  );
reduceSuccessive([1, 2, 3, 4, 5, 6], (acc, val) => acc + val, 0); // [0, 1, 3, 6, 10, 15, 21]

// https://30secondsofcode.org/#reducewhich
const reduceWhich = <T>(arr: T[], comp: Comparator<T, number>): T =>
  arr.reduce((a: T, b: T) => (comp(a, b) >= 0 ? b : a));
reduceWhich([1, 3, 2], (a, b) => a - b); // 1
reduceWhich([1, 3, 2], (a, b) => b - a); // 3
reduceWhich(
  [
    { name: "Tom", age: 12 },
    { name: "Jack", age: 18 },
    { name: "Lucy", age: 9 },
  ],
  (a, b) => a.age - b.age,
); // {name: "Lucy", age: 9}

// https://30secondsofcode.org/#reject
const reject = <T>(pred: Filterer<T>, arr: T[]): T[] =>
  arr.filter((x: T, i: number, a: T[]) => !pred(x, i, a));
reject((x: number) => x % 2 === 0, [1, 2, 3, 4, 5]); // [1, 3, 5]
reject((word: string) => word.length > 4, ["Apple", "Pear", "Kiwi", "Banana"]); // ['Pear', 'Kiwi']

// https://30secondsofcode.org/#remove
const remove = <T>(pred: Filterer<T>, arr: T[]): T[] => arr.filter(pred);
remove((n: number) => n % 2 === 0, [1, 2, 3, 4, 5]); // [2, 4]

// https://30secondsofcode.org/#sample
const sample = <T>(arr: T[]): T | undefined =>
  arr[Math.floor(Math.random() * arr.length)];
sample([3, 7, 9, 11]); // 9

const shank = <T>(arr: T[], index = 0, delCount = 0, ...elements: T[]): T[] =>
  arr
    .slice(0, index)
    .concat(elements)
    .concat(arr.slice(index + delCount));
const names = ["alpha", "bravo", "charlie"];
shank(names, 1, 0, "delta"); // [ 'alpha', 'delta', 'bravo', 'charlie' ]
shank(names, 1, 1); // [ 'alpha', 'charlie' ]

const shuffle = <T>([...arr]: T[]): T[] => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};
const foo = [1, 2, 3];
shuffle(foo); // [2, 3, 1], foo = [1, 2, 3]

// https://30secondsofcode.org/#samplesize
const sampleN = <T>(arr: T[], n = 1): T[] => shuffle(arr).slice(0, n);
sampleN([1, 2, 3], 2); // [3,1]
sampleN([1, 2, 3], 4); // [2,3,1]

// https://30secondsofcode.org/#similarity
const similarity = <T>(a: T[], b: T[]): T[] =>
  a.filter((v: T) => b.includes(v));
similarity([1, 2, 3], [1, 2, 4]); // [1, 2]

// https://30secondsofcode.org/#sortedindex
const sortedIndex = <T>(arr: T[], n: T): number => {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr.findIndex((el: T) => (isDescending ? n >= el : n <= el));
  return index === -1 ? arr.length : index;
};
sortedIndex([5, 3, 2, 1], 4); // 1
sortedIndex([30, 50], 40); // 1

// https://30secondsofcode.org/#sortedindexby
const sortedIndexBy = <T, U>(arr: T[], n: T, fn: Mapper<T, U>): number => {
  const isDescending = fn(arr[0]) > fn(arr[arr.length - 1]);
  const val = fn(n);
  const index = arr.findIndex((el: T) =>
    isDescending ? val >= fn(el) : val <= fn(el),
  );
  return index === -1 ? arr.length : index;
};
sortedIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, (o) => o.x); // 0

// https://30secondsofcode.org/#sortedlastindex
const sortedLastIndex = <T>(arr: T[], n: T): number => {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr
    .reverse()
    .findIndex((el: T) => (isDescending ? n <= el : n >= el));
  return index === -1 ? 0 : arr.length - index;
};
sortedLastIndex([10, 20, 30, 30, 40], 30); // 4

// https://30secondsofcode.org/#sortedlastindexby
const sortedLastIndexBy = <T, U>(arr: T[], n: T, fn: Mapper<T, U>): number => {
  const isDescending = fn(arr[0]) > fn(arr[arr.length - 1]);
  const val = fn(n);
  const index = arr
    .map(fn)
    .reverse()
    .findIndex((el) => (isDescending ? val <= el : val >= el));
  return index === -1 ? 0 : arr.length - index;
};
sortedLastIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, (o) => o.x); // 1

const stableSort = <T>(arr: T[], comp: Comparator<T, number>): T[] =>
  arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => comp(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);
stableSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => 0); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// https://30secondsofcode.org/#symmetricdifference
const symmetricDifference = <T>(a: T[], b: T[]): T[] => {
  const sA = new Set(a);
  const sB = new Set(b);
  return [...a.filter((x: T) => !sB.has(x)), ...b.filter((x: T) => !sA.has(x))];
};
symmetricDifference([1, 2, 3], [1, 2, 4]); // [3, 4]
symmetricDifference([1, 2, 2], [1, 3, 1]); // [2, 2, 3]

// https://30secondsofcode.org/#symmetricdifferenceby
const symmetricDifferenceBy = <T, U>(a: T[], b: T[], fn: Mapper<T, U>): T[] => {
  const sA = new Set(a.map(fn));
  const sB = new Set(b.map(fn));
  return [...a.filter((x: T) => !sB.has(fn(x))), ...b.filter((x: T) => !sA.has(fn(x)))];
};
symmetricDifferenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [ 1.2, 3.4 ]

// https://30secondsofcode.org/#symmetricdifferencewith
const symmetricDifferenceWith = <T>(a: T[], b: T[], comp: Comparator<T, boolean>): T[] => [
  ...a.filter((x: T) => b.findIndex((y: T) => comp(x, y)) === -1),
  ...b.filter((x: T) => a.findIndex((y: T) => comp(x, y)) === -1),
];
symmetricDifferenceWith(
  [1, 1.2, 1.5, 3, 0],
  [1.9, 3, 0, 3.9],
  (a, b) => Math.round(a) === Math.round(b),
); // [1, 1.2, 3.9]

// https://30secondsofcode.org/#tail
// Altered so that it will return an empty array for an array of 1 item
// since that's how it would behave in any sane language
const tail = <T>(arr: T[]): T[] => arr.length >= 1 ? arr.slice(1) : arr;
tail([1, 2, 3]); // [2,3]
tail([1]); // []
tail([]); // []

// https://30secondsofcode.org/#take
const take = <T>(arr: T[], n = 1): T[] => arr.slice(0, n);
take([1, 2, 3], 5); // [1, 2, 3]
take([1, 2, 3], 0); // []

// https://30secondsofcode.org/#takeright
const takeRight = <T>(arr: T[], n = 1): T[] => arr.slice(arr.length - n, arr.length);
takeRight([1, 2, 3], 2); // [ 2, 3 ]
takeRight([1, 2, 3]); // [3]

// https://30secondsofcode.org/#takewhile
const takeWhile = <T>(arr: T[], filter: Filterer<T>): T[] => {
  for (const [i, val] of arr.entries()) {
    if (filter(val)) {
      return arr.slice(0, i);
    }
  }
  return arr;
};
takeWhile([1, 2, 3, 4], (n: number) => n >= 3); // [1, 2]

// https://30secondsofcode.org/#tohash
function toHash<T>(object: Iterable<T>): IObject<T>;
function toHash<T extends IObject<any>>(object: Iterable<T>, key: string): IObject<T>;
function toHash<T extends IObject<any>>(object: Iterable<T>, key?: string): any {
  return Array.prototype.reduce.call(
    object,
    (acc: any, data: any, index: number): IObject<T> => {
      acc[!key ? index : data[key]] = data;
      return acc;
    },
    {},
  );
}
toHash([4, 3, 2, 1]); // { '0': 4, '1': 3, '2': 2, '3': 1 }
toHash([{ a: "label" }], "a"); // { label: { a: 'label' } }
const users = [
  {
    first: "Jon",
    id: 1,
  }, {
    first: "Joe",
    id: 2,
  }, {
    first: "Moe",
    id: 3,
  }];
const managers = [
  {
    employees: [2, 3],
    manager: 1,
  },
];
managers.map((manager) => ({
  ...manager,
  employees: manager.employees.map(function(this: IObject<{
    first: string;
    id: number;
  }>,                                       id: number) {
    return this[id];
  }, toHash(users, "id")),
})); // [ { first: 'Joe', id: 2 }, { first: 'Moe', id: 3 } ]

// https://30secondsofcode.org/#union
const union = <T>(a: T[], b: T[]): T[] => Array.from(new Set([...a, ...b]));
union([1, 2, 3], [4, 3, 2]); // [1,2,3,4]

// https://30secondsofcode.org/#unionby
const unionBy = <T, U>(a: T[], b: T[], fn: Mapper<T, U>): T[] => {
  const s: Set<U> = new Set(a.map(fn));
  return Array.from(new Set([
    ...a,
    ...b.filter((x: T) => !s.has(fn(x))),
  ]));
};
unionBy([2.1], [1.2, 2.3], Math.floor); // [2.1, 1.2]

// https://30secondsofcode.org/#unionwith
const unionWith = <T>(a: T[], b: T[], comp: Comparator<T, boolean>): T[] =>
  Array.from(new Set([
    ...a,
    ...b.filter((x: T) => a.findIndex((y: T) => comp(x, y)) === -1),
  ]));
unionWith([1, 1.2, 1.5, 3, 0], [1.9, 3, 0, 3.9], (a, b) => Math.round(a) === Math.round(b)); // [1, 1.2, 1.5, 3, 0, 3.9]

// https://30secondsofcode.org/#uniqueelements
const unique = <T>(arr: T[]): T[] => [...new Set(arr)];
unique([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]

// https://30secondsofcode.org/#uniqueelementsby
const uniqueBy = <T>(arr: T[], comp: Comparator<T, boolean>): T[] =>
  arr.reduce((acc: T[], v: T) => {
    if (!acc.some((x: T) => comp(v, x))) {
      return [...acc, v];
    }
    return acc;
  }, []);
uniqueBy(
  [
    { id: 0, value: "a" },
    { id: 1, value: "b" },
    { id: 2, value: "c" },
    { id: 1, value: "d" },
    { id: 0, value: "e" },
  ],
  (a, b) => a.id === b.id,
); // [ { id: 0, value: 'a' }, { id: 1, value: 'b' }, { id: 2, value: 'c' } ]

// https://30secondsofcode.org/#uniqueelementsbyright
const uniqueByRight = <T>(arr: T[], comp: Comparator<T, boolean>): T[] =>
  arr.reduceRight((acc: T[], v: T) => {
    if (!acc.some((x: T) => comp(v, x))) {
      return [...acc, v];
    }
    return acc;
  }, []);
uniqueByRight(
  [
    { id: 0, value: "a" },
    { id: 1, value: "b" },
    { id: 2, value: "c" },
    { id: 1, value: "d" },
    { id: 0, value: "e" },
  ],
  (a, b) => a.id === b.id,
); // [ { id: 0, value: 'e' }, { id: 1, value: 'd' }, { id: 2, value: 'c' } ]

// https://30secondsofcode.org/#uniquesymmetricdifference
const uniqueSymmetricDifference = <T>(a: T[], b: T[]): T[] => [
  ...new Set(symmetricDifference(a, b)),
];
uniqueSymmetricDifference([1, 2, 3], [1, 2, 4]); // [3, 4]
uniqueSymmetricDifference([1, 2, 2], [1, 3, 1]); // [2, 3]

// https://30secondsofcode.org/#unzip
const unzip = <T>(arr: T[][]): T[][] =>
  arr.reduce(
    (acc: T[][], val: T[]) => {
      val.forEach((v: T, i: number) => acc[i].push(v));
      return acc;
    },
    Array.from({
      length: Math.max(...arr.map((x: T[]) => x.length)),
    }).map((_) => []),
  );
unzip([["a", 1, true], ["b", 2, false]]); // [['a', 'b'], [1, 2], [true, false]]
unzip([["a", 1, true], ["b", 2]]); // [['a', 'b'], [1, 2], [true]]

// https://30secondsofcode.org/#unzipwith
const unzipWith = <T, U>(arr: T[][], reducer: (...x: T[]) => U): U[] =>
  unzip(arr).map((x: T[]) => reducer(...x));
unzipWith(
  [[1, 10, 100], [2, 20, 200]],
  (...args: number[]) => args.reduce((acc: number, v: number) => acc + v, 0),
); // [3, 30, 300]

// https://30secondsofcode.org/#xprod
const xProd = (a: any[], b: any[]): any[] =>
  a.reduce((acc: any[], x) => acc.concat(b.map((y) => [x, y])), []);
xProd([1, 2], ["a", "b"]); // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]

// https://30secondsofcode.org/#zip
const zip = (...arrays: any[][]): any[][] =>
  Array
    .from({
      length: Math.max(...arrays.map((x) => x.length)),
    }).map((_, i) => Array
      .from(
        { length: arrays.length },
        (__, k) => arrays[k][i],
      ),
    );
zip(["a", "b"], [1, 2], [true, false]); // [['a', 1, true], ['b', 2, false]]
zip(["a"], [1, 2], [true, false]); // [['a', 1, true], [undefined, 2, false]]

// https://30secondsofcode.org/#zipobject
const zipObject = <T>(props: Array<string | number>, values: T[]): IObject<T> =>
  props.reduce((obj: IObject<T>, prop: string | number, i: number) => {
    obj[prop] = values[i];
    return obj;
  }, {});

const zipWith = <T>(fn: (...arrs: T[]) => any, ...array: T[][]): any[] =>
  Array.from(
    { length: Math.max(...array.map((a: T[]) => a.length)) },
    (_, i: number) => fn(...array.map((a: T[]) => a[i])),
  );

zipWith((a, b, c) => a + b + c, [1, 2], [10, 20], [100, 200]);
const shittyAdd = (a?: number, b?: number, c?: number): string | number => {
  let thing: string | number;
  thing = a != null ? a : "a";
  if (b != null) {
    if (typeof thing === "number") {
      thing += b;
    } else {
      thing += b.toString();
    }
  } else {
    thing += "b";
  }
  if (c != null) {
    if (typeof thing === "number") {
      thing += c;
    } else {
      thing += c.toString();
    }
  } else {
    thing += "c";
  }
  return thing;
};
zipWith(
  shittyAdd,
  [1, 2, 3],
  [10, 20],
  [100, 200],
); // [111, 222, '3bc']
