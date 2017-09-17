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
  const getDensity = (tm) => {
    return (c / (ts - te) ** 2) * (tm - te) ** 2;
  };
  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };
  const hasEnoughDensity = (arc, x, y) => {
    const d = getDistance(...arc, x, y);

    if (d <= 30) {
      const dens = getDensity(d);

      return dens >= 1.0;
    }

    return false;
  };

  // get cm for first arc;
  for (let x = 0; x <= 230; x++) {
    for (let y = 0; y <= 130; y++) {
      arcs.forEach((arc) => {
        if (hasEnoughDensity(arc, x, y)) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 360 * Math.PI / 180);
          ctx.stroke();
        }
      });
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