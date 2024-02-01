class Agent {
  //path
  //set of vectors to describe the curves of the word
  //the midpoint of each vector is where the peak of the bezier curve should be
  initPath;
  path;

  //offset
  ox;
  oy;

  //drawing
  drawing;
  seg;
  segProgress;
  segT;
  h;

  // fade
  fading;
  opacity;

  // erraticness
  spread;
  inc;
  target;

  constructor(word, xOffset, yOffset, steps = 50) {
    //path
    this.initPath = word;
    this.path = word.map(function (arr) {
      return arr.slice();
    });

    //erraticness
    this.target = [...Array(word.length)].map(() => Array(4).fill(0));
    this.spread = 0;
    this.inc = 1 / (steps * 2); // no real reason, just wanted something proportionate

    //offset
    this.ox = xOffset;
    this.oy = yOffset;

    //drawing
    this.drawing = true;
    this.seg = 1;
    this.segProgress = 0;
    this.segT = 0;
    this.h = steps;

    //fade
    this.fading = false;
    this.opacity = 225;
  }

  // returns true if the word is fully drawn
  done() {
    return !this.drawing;
  }

  // returns the largest x-coordinate of the word
  tail() {
    return this.path[this.path.length - 1][0] + this.ox;
  }

  // increase the range the curves can float and speed up accordingly
  increaseSpread(s) {
    //limit the spread because there is such a thing as too much
    if (s < 175) {
      this.spread = s;
    }
    this.inc += s / 10000;
  }

  // signals for the opacity to start decreasing
  beginFade() {
    this.fading = true;
  }

  // returns true if the word has fully faded away
  faded() {
    return this.opacity <= 0;
  }

  update() {
    // slowly decrease the opacity if it needs to fade away
    if (this.fading) {
      this.opacity -= this.inc;
    }

    // spread in some direction
    for (let [i, v] of this.path.entries()) {
      // start/end points stay in place as well as any curves that aren't drawn by the "pencil" yet
      if (i == 0 || i == this.path.length - 1) continue;
      if (i > this.seg) break;

      // change path x1 values to reach a random target point
      if (this.target[i][0] < 0) {
        v[0] -= this.inc;
        this.target[i][0]++;
      } else if (this.target[i][0] > 0) {
        v[0] += this.inc;
        this.target[i][0]--;
      } else {
        // set the target point to always allow some movement back to its orignal x1 position
        if (this.initPath[i][0] < v[0]) {
          this.target[i][0] = -round(random(this.spread));
        } else {
          this.target[i][0] = round(random(this.spread));
        }
      }

      // change path y1 values to reach a random target point
      if (this.target[i][1] < 0) {
        v[1] -= this.inc * 2;
        this.target[i][1]++;
      } else if (this.target[i][1] > 0) {
        v[1] += this.inc * 2;
        this.target[i][1]--;
      } else {
        // set the target point to always allow some movement back to its orignal y1 position
        if (this.initPath[i][1] < v[1]) {
          this.target[i][1] = -round(random(this.spread));
        } else {
          this.target[i][1] = round(random(this.spread));
        }
      }
    }
  }

  draw() {
    push();

    strokeWeight(1);
    stroke(10, this.opacity);
    noFill();

    translate(this.ox, this.oy);
    scale(0.9);

    // the writing "pencil"
    let endX = 0;
    let endY = 0;

    if (this.drawing) {
      let path = this.path;
      let seg = this.seg;

      // variables for cubic equations because bezier curves are cubic
      // need for x-c0ord and y-coord
      let ax, ay, bx, by, cx, cy, dx, dy;
      let v = path[seg];

      if (seg == 1) {
        ax = path[0][0];
        ay = path[0][1];
      } else {
        ax = midV(path[seg - 1])[0];
        ay = midV(path[seg - 1])[1];
      }

      bx = path[seg - 1][2];
      by = path[seg - 1][3];
      cx = v[0];
      cy = v[1];
      dx = midV(v)[0];
      dy = midV(v)[1];

      let approxPath = [[ax, ay, 0, 0]];

      // calc some x,y coords using cubic formula to find approx final seg lengths for time/progress t
      // needs to be done each draw because the previous segments are already beginning to move
      for (let t = 1; t < 101; t++) {
        let x =
          (1 - t / 100) ** 3 * ax +
          3 * (1 - t / 100) ** 2 * (t / 100) * bx +
          3 * (1 - t / 100) * (t / 100) ** 2 * cx +
          (t / 100) ** 3 * dx;
        let y =
          (1 - t / 100) ** 3 * ay +
          3 * (1 - t / 100) ** 2 * (t / 100) * by +
          3 * (1 - t / 100) * (t / 100) ** 2 * cy +
          (t / 100) ** 3 * dy;

        // approxPath[t] = x, y, approx. length @ t, t
        approxPath[t] = [
          x,
          y,
          dist(x, y, approxPath[t - 1][0], approxPath[t - 1][1]) +
            approxPath[t - 1][2],
          t,
        ];
      }

      // "pencil" trail of circles for current segment up to elapsed time, this.segT, on current segment
      for (let i = 0; i < this.segT; i++) {
        let t_i = i / this.h;
        endX =
          (1 - t_i) ** 3 * ax +
          3 * (1 - t_i) ** 2 * t_i * bx +
          3 * (1 - t_i) * t_i ** 2 * cx +
          t_i ** 3 * dx;
        endY =
          (1 - t_i) ** 3 * ay +
          3 * (1 - t_i) ** 2 * t_i * by +
          3 * (1 - t_i) * t_i ** 2 * cy +
          t_i ** 3 * dy;

        circle(endX, endY, 0.5);
      }
      this.segProgress =
        this.segProgress >= 1 ? 1 : this.segProgress + 1 / this.h;

      // find step closest to the progress thats supposed to be made on segment so far
      this.segT = 0;
      let len = approxPath[approxPath.length - 1][2];
      while (approxPath[this.segT][2] < this.segProgress * len) {
        this.segT++;
      }

      if (this.segT >= this.h) {
        this.segProgress = 0;
        this.segT = 0;
        this.seg++;

        if (this.seg >= path.length) this.drawing = false;
      }
    }

    // draw the completed segments of the word as bezier curves so the "pencil" doesnt have to draw so many circles
    // endpoints of the curve are the midpoints of two adjacent path entries
    for (let [i, v] of this.path.entries()) {
      if (i >= this.seg && this.drawing) break;
      else if (i === 1) {
        bezier(
          this.path[i - 1][0],
          this.path[i - 1][1],
          this.path[i - 1][2],
          this.path[i - 1][3],
          v[0],
          v[1],
          midV(v)[0],
          midV(v)[1]
        );
      } else if (i > 1) {
        bezier(
          midV(this.path[i - 1])[0],
          midV(this.path[i - 1])[1],
          this.path[i - 1][2],
          this.path[i - 1][3],
          v[0],
          v[1],
          midV(v)[0],
          midV(v)[1]
        );
      }
    }

    pop();
  }
}

function midV(v) {
  return [(v[2] + v[0]) / 2, (v[3] + v[1]) / 2];
}
