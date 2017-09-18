import React from "react";
import Head from "next/head";

const renderStage = () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const width = document.getElementById("wrapper").clientWidth;
  const height = document.getElementById("wrapper").clientHeight;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  const arcs = [
    [100, 100],
    [200, 100],
  ]

  arcs.forEach((arc) => {
    ctx.beginPath();
    ctx.arc(...arc, 10, 0, 360 * Math.PI / 180);
    ctx.stroke();
  });

  const c = 10; // 調整必要かも?
  const ts = 10;
  const te = 30;
  const getConcentration = (tm) => {
    return (c / ((ts - te) ** 2)) * ((tm - te) ** 2);
  };
  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };
  const drawByConcentration = (arcs, x1, y1, cellSize) => {
    const x2 = x1 + cellSize;
    const y2 = y1 + cellSize;

    const vertexes = [
      [x1, y1], [x2, y1],
      [x1, y2], [x2, y2],
    ];

    const clim = 0.3;
    const vc = vertexes.map((v) => {
      const [x, y] = v;

      let sum = 0;
      arcs.forEach((arc) => {
        const d = getDistance(...arc, x, y);
        const c = getConcentration(d);

        if (d <= 30) {
          sum += c;
        }
      });

      return sum;
    });

    const flg = vc.map((c) => {
      return c >= clim ? "1" : "0";
    }).join("");

    if (flg === "1111" || flg === "0000") {
      return;
    }

    const [
      c1, c2,
      c3, c4,
    ] = vc;

    let ary = [];
    if (flg === "1101") {
      ary = [
        [c3, c4, c1],
      ];
    }
    if (flg === "0001") {
      ary = [
        [c4, c3, c2],
      ];
    }

    ary.forEach((a) => {
      const [c, cx, cy] = a;
      // x1, x2 も変数にしないとダメそう
      const x3 = x1 * (Math.abs(c - clim) / Math.abs(c - cx)) + x2 * (Math.abs(cx - clim) / Math.abs(c - cx));
      const y3 = y1 * (Math.abs(c - clim) / Math.abs(c - cy)) + y2 * (Math.abs(cy - clim) / Math.abs(c - cy));

      ctx.beginPath();
      ctx.moveTo(x3, y2);
      ctx.lineTo(x2, y3);
      ctx.stroke();
      ctx.closePath();
    });
  };

  const xlim = 230;
  const ylim = 130;
  const division = 10;

  for (let x = 0; x <= xlim / division; x++) {
    for (let y = 0; y <= ylim / division; y++) {
      drawByConcentration(arcs, x * division, y * division, division);
    }
  }
};

export default class extends React.Component {
  componentDidMount() {
    this.initDatGUI({});

    renderStage();
  }

  initDatGUI(stage) {
    const gui = new dat.GUI();
  }

  render() {
    return (
      <div id="wrapper" className="wrapper">
        {this.head()}
        <canvas id="stage" className="stage" />
        <style jsx>{`
          div {
            width: calc(100vw - 50px);
            height: 100vh;
            margin: 25px;
          }
          canvas {
            width: calc(100vw - 25px - 25px);
            height: calc(100vh - 25px - 25px);
            border: 1px solid #000;
            border-radius: 2px;
          }
        `}</style>
        <style jsx global>{`
          html,
          body {
            margin: 0;
            padding: 0;
          }
        `}</style>
      </div>
    );
  }

  head() {
    return (
      <Head>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js"></script>
      </Head>
    );
  }
}