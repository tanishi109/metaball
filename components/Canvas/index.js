import React from "react";
import Head from "next/head";

const renderStage = (x = 200, division = 5) => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const width = document.getElementById("wrapper").clientWidth;
  const height = document.getElementById("wrapper").clientHeight;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  ctx.clearRect(0, 0, width, height);

  const arcs = [
    [100, 100],
    [x, 100],
    [100, x],
  ];

  const r = 5;
  arcs.forEach((arc) => {
    ctx.beginPath();
    ctx.arc(...arc, r, 0, 360 * Math.PI / 180);
    ctx.stroke();
  });

  const c = 10; // 調整必要かも?
  const ts = r;
  const te = 40;
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

    const clim = 3;
    const vc = vertexes.map((v) => {
      const [x, y] = v;

      let sum = 0;
      arcs.forEach((arc) => {
        const d = getDistance(...arc, x, y);
        const c = getConcentration(d);

        if (d <= te) {
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
    // holizontal
    if (flg === "1100" || flg === "0011") {
      const y3 = y2 * (Math.abs(c1 - clim) / Math.abs(c1 - c3)) + y1 * (Math.abs(c3 - clim) / Math.abs(c1 - c3));
      const y4 = y2 * (Math.abs(c2 - clim) / Math.abs(c2 - c4)) + y1 * (Math.abs(c4 - clim) / Math.abs(c2 - c4));
      
      ctx.beginPath();
      ctx.moveTo(x1, y3);
      ctx.lineTo(x2, y4);
      ctx.stroke();
      ctx.closePath();
    }
    // vertical
    if (flg === "1010" || flg === "0101") {
      const x3 = x2 * (Math.abs(c1 - clim) / Math.abs(c1 - c2)) + x1 * (Math.abs(c2 - clim) / Math.abs(c1 - c2));
      const x4 = x2 * (Math.abs(c3 - clim) / Math.abs(c3 - c4)) + x1 * (Math.abs(c4 - clim) / Math.abs(c3 - c4));

      ctx.beginPath();
      ctx.moveTo(x3, y1);
      ctx.lineTo(x4, y2);
      ctx.stroke();
      ctx.closePath();
    }
    // left top
    if (flg === "1000" || flg === "0111" || flg === "1001") {
      const x3 = x2 * (Math.abs(c1 - clim) / Math.abs(c1 - c2)) + x1 * (Math.abs(c2 - clim) / Math.abs(c1 - c2));
      const y3 = y2 * (Math.abs(c1 - clim) / Math.abs(c1 - c3)) + y1 * (Math.abs(c3 - clim) / Math.abs(c1 - c3));

      ctx.beginPath();
      ctx.moveTo(x3, y1);
      ctx.lineTo(x1, y3);
      ctx.stroke();
      ctx.closePath();
    }
    // right top
    if (flg === "0100" || flg === "1011" || flg === "0110") {
      const x3 = x1 * (Math.abs(c2 - clim) / Math.abs(c2 - c1)) + x2 * (Math.abs(c1 - clim) / Math.abs(c2 - c1));
      const y3 = y2 * (Math.abs(c2 - clim) / Math.abs(c2 - c4)) + y1 * (Math.abs(c4 - clim) / Math.abs(c2 - c4));

      ctx.beginPath();
      ctx.moveTo(x3, y1);
      ctx.lineTo(x2, y3);
      ctx.stroke();
      ctx.closePath();
    }
    // left bottom
    if (flg === "1101" || flg === "0010" || flg === "0110") {
      const x3 = x2 * (Math.abs(c3 - clim) / Math.abs(c3 - c4)) + x1 * (Math.abs(c4 - clim) / Math.abs(c3 - c4));
      const y3 = y1 * (Math.abs(c3 - clim) / Math.abs(c3 - c1)) + y2 * (Math.abs(c1 - clim) / Math.abs(c3 - c1));

      ctx.beginPath();
      ctx.moveTo(x3, y2);
      ctx.lineTo(x1, y3);
      ctx.stroke();
      ctx.closePath();
    }
    // right bottom
    if (flg === "0001" || flg === "1110" || flg === "1001") {
      const x3 = x1 * (Math.abs(c4 - clim) / Math.abs(c4 - c3)) + x2 * (Math.abs(c3 - clim) / Math.abs(c4 - c3));
      const y3 = y1 * (Math.abs(c4 - clim) / Math.abs(c4 - c2)) + y2 * (Math.abs(c2 - clim) / Math.abs(c4 - c2));

      ctx.beginPath();
      ctx.moveTo(x3, y2);
      ctx.lineTo(x2, y3);
      ctx.stroke();
      ctx.closePath();
    }
  };

  const xlim = 230;
  const ylim = 230;

  for (let x = 0; x <= xlim / division; x++) {
    for (let y = 0; y <= ylim / division; y++) {
      drawByConcentration(arcs, x * division, y * division, division);
    }
  }
};

export default class extends React.Component {
  componentDidMount() {
    this.initDatGUI();

    renderStage();
  }

  initDatGUI() {
    const gui = new dat.GUI();
    const params = {
      x: 200,
      division: 5,
    };

    const ex = gui.add(params, "x", 100, 200);
    ex.onChange((val) => {
      renderStage(val, params.division);
    });

    const ed = gui.add(params, "division", 2, 20);
    ed.onChange((val) => {
      renderStage(params.x, val);
    });
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