// cursive looking shapes that could be combined to make letters/words
const lower = [
  [6, 52, 26, 52],
  [18, 36, 14, 28],
  [15, 99, 23, 90],
  [16, 53, 15, 51],
  [15, 52, 34, 52],
];

const circleish = [
  [14, 52, 49, 53],
  [31, 30, 8, 26],
  [15, 51, 37, 50],
  [34, 32, 10, 30],
  [41, 37, 47, 30],
  [45, 46, 65, 53],
];

const upperTall = [
  [16, 52, 47, 52],
  [37, 17, 32, 1],
  [26, 52, 72, 52],
];

const upperLow = [
  [15, 52, 51, 52],
  [38, 31, 19, 18],
  [25, 52, 79, 52],
];

const uShape = [
  [7, 52, 28, 52],
  [18, 30, 17, 23],
  [27, 51, 41, 48],
  [45, 35, 40, 21],
  [45, 52, 70, 52],
];

const nShape = [
  [14, 52, 36, 52],
  [20, 33, 40, 27],
  [30, 52, 59, 52],
];

// one fully completed word from experimenting that I didnt want to delete
// my hard work :')
const lerpShape = [
  [8, 52, 20, 55],
  [15, 28, 6, 17],
  [7, 54, 22, 55],
  [27, 46, 17, 36],
  [17, 55, 31, 55],
  [33, 43, 26, 39],
  [42, 45, 45, 35],
  [41, 56, 53, 56],
  [50, 43, 46, 36],
  [48, 81, 54, 72],
  [47, 56, 40, 53],
  [57, 38, 64, 46],
  [48, 52, 70, 55],
];

class curvsiveLib {
  word;

  constructor() {
    this.word = [];
  }

  generateWord() {
    // not letting my test shape go to waste!!
    if (random() < 0.01) {
      return lerpShape;
    }

    // randomly choose a length and combine different cursive shapes to make a "word"
    let word = [];
    let temp = [];
    let total = round(random(1, 10));
    let offset = 0;

    for (let i = 0; i < total; i++) {
      let type = round(random(1, 6));
      switch (type) {

        case 1:
          if (i > 0) offset = word[word.length - 1][0] - lower[0][0] + 5;
          temp = lower.map(function (arr) {
            let point = arr.slice();
            point[0] += offset;
            point[2] += offset;
            return point;
          });
          word = word.concat(temp);
          break;

        case 2:
          if (i > 0) offset = word[word.length - 1][0] - circleish[0][0] + 5;
          temp = circleish.map(function (arr) {
            let point = arr.slice();
            point[0] += offset;
            point[2] += offset;
            return point;
          });
          word = word.concat(temp);
          break;

        case 3:
          if (i > 0) offset = word[word.length - 1][0] - upperTall[0][0] + 5;
          temp = upperTall.map(function (arr) {
            let point = arr.slice();
            point[0] += offset;
            point[2] += offset;
            return point;
          });
          word = word.concat(temp);
          break;

        case 4:
          if (i > 0) offset = word[word.length - 1][0] - upperLow[0][0] + 5;
          temp = upperLow.map(function (arr) {
            let point = arr.slice();
            point[0] += offset;
            point[2] += offset;
            return point;
          });
          word = word.concat(temp);
          break;

        case 5:
          if (i > 0) offset = word[word.length - 1][0] - uShape[0][0] + 5;
          temp = uShape.map(function (arr) {
            let point = arr.slice();
            point[0] += offset;
            point[2] += offset;
            return point;
          });
          word = word.concat(temp);
          break;

        case 6:
          if (i > 0) offset = word[word.length - 1][0] - nShape[0][0] + 5;
          temp = nShape.map(function (arr) {
            let point = arr.slice();
            point[0] += offset;
            point[2] += offset;
            return point;
          });
          word = word.concat(temp);
          break;
      }
    }
    this.word = word;

    return word;
  }

  // return the largest x-coordinate of generated word, w
  wordLen(w) {
    return w[w.length - 1][0];
  }
}
