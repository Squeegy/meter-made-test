// @flow

// Take HSV in 0-255 range and return rgb
export default function hsv(h: number, s: number, v: number): number[] {
  h = ((h % 256) / 255) * 360;
  if (h < 0) h += 360;

  s = ((s % 256) / 255) * 100;
  v = ((v % 256) / 255) * 100;

  return hsvToRgb(h, s, v);
}

const round = Math.round;

// https://github.com/michaelrhodes/hsv-rgb/blob/master/index.js
function hsvToRgb(h, s, v) {
  var s = s / 100,
    v = v / 100;
  var c = v * s;
  var hh = h / 60;
  var x = c * (1 - Math.abs((hh % 2) - 1));
  var m = v - c;

  var p = parseInt(hh, 10);
  var rgb =
    p === 0
      ? [c, x, 0]
      : p === 1
        ? [x, c, 0]
        : p === 2
          ? [0, c, x]
          : p === 3
            ? [0, x, c]
            : p === 4
              ? [x, 0, c]
              : p === 5
                ? [c, 0, x]
                : [];

  return [
    round(255 * (rgb[0] + m)),
    round(255 * (rgb[1] + m)),
    round(255 * (rgb[2] + m))
  ];
}
