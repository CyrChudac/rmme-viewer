<template>
  <div/>
</template>

<script>
  import {select as d3Select, line as d3Line, area as d3Area} from "d3";

  import {
    range,
    computeMargin,
    computeLayout,
    createGraphSvg,
    configureGraphSvg,
    addXLinearScale,
    addYLinearScale,
    addFocusLine,
    addGrid,
    addText,
  } from "./utils.js";

  import "./style.css";

  export default {
    "name": "d3js-line-area-plot",
    "props": {
      "line": {"type": Array, "required": true},
      "area": {"type": Array, "required": true},
      "text": {"type": Array, "default": () => ([])},
      "heightModifier": {"type": Number, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "args": {"type": Object, "default": () => ({})},
      "pretext": {"type": String, "default": () => ""},
      "units": {"type": String, "default": () => ""},
    },
    "data": () => ({
      "svg": null,
    }),
    "mounted": function () {
      this.svg = createGraphSvg(d3Select(this.$el));
      this.onPlot();
    },
    "watch": {
      "resizeNotification": function () {
        this.onPlot();
      },
      "line": function () {
        this.onPlot();
      },
      "area": function () {
        this.onPlot();
      },
    },
    "methods": {
      "getScreenSize": function () {
        const element = this.$el.parentElement;
        return {
          "width": element.offsetWidth,
          "height": element.offsetHeight
        };
      },
      "onPlot": function () {
        const args = getArgs(this.args);
        const allData = [...this.line, ...this.area];
        const xRange = range(allData, (item) => item["x"], args.xRange);
        const yRange = range(allData, (item) => {
          if (item["y"] !== undefined) {
            return item["y"];
          }
          return [...item["y-low"], ...item["y-high"]]
        }, args.yRange);
        const margin = computeMargin(yRange, args["margin"]);
        const layout = computeLayout(margin, this.getScreenSize(), this.heightModifier);
        const plot = configureGraphSvg(this.svg, layout, margin);
        const x = addXLinearScale(plot, xRange, layout);
        const y = addYLinearScale(plot, yRange, layout);

        const areas = plot.selectAll("g.plot-area path").data(this.area);
        areas.exit().remove();
        areas
          .enter()
          .append("g")
          .attr("class", "plot-area")
          .attr("opacity", 0.5)
          .append("path")
          .attr("stroke", "none")
          .merge(areas)
          .attr("fill", (data) => data["color"])
          .attr("d", getAreaPathFactory(x, y));

        const lines = plot.selectAll("path.plot-line").data(this.line);
        lines.exit().remove();
        lines
          .enter()
          .append("path")
          .attr("class", "plot-line")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .merge(lines)
          .attr("stroke", (data) => data["color"])
          .attr("d", getLinePathFactory(x, y));

        if (args.useFocus) {
          addFocusLine(plot, x, y, layout, this.focusData(), this.args, this.pretext, this.units);
        }

        addGrid(plot, x, y, layout);

        addText(plot, x, y, this.text);
      },
      "focusData": function () {
        let result = [];
        this.area.forEach(a => 
          {
            result.push({
              "label": a["label"] + "-min",
              "color": a["color"],
              "y": a["y-low"],
              "x": a["x"],
            });
            result.push({
              "label": a["label"] + "-max",
              "color": a["color"],
              "y": a["y-high"],
              "x": a["x"],
            });
          });
        return [
          ...result,
          ...this.line
        ];
      }
    }
  }

  function getArgs(args) {
    return {
      "margin": {},
      ...args
    }
  }

  function getAreaPathFactory(x, y) {
    return (data) => d3Area()
      .x(function (_, index) {
        return x(data.x[index]);
      })
      .y0((_, index) => y(data["y-low"][index]))
      .y1((_, index) => y(data["y-high"][index]))
      (data.x);
  }

  function getLinePathFactory(x, y) {
    return (data) =>
      d3Line()
        .x(function (_, index) {
          return x(data.x[index]);
        })
        .y(function (_, index) {
          return y(data.y[index]);
        })(data.x);

  }

</script>
