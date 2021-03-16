<template>
  <span
    style="margin-left: 20px;"
  >
    <no-data v-if="!dataAvailable" />
    <div
      v-else
      style="margin-left: inherit;"
    >
      <d3-line-plot
        :data="ffqData"
        :text="plotText"
        :heightModifier=1.7
        :resize-notification="resizeNotification"
        :args="args"
      />
      <d3-line-plot
        :data="lfqData"
        :text="plotText"
        :heightModifier=1.7
        :resize-notification="resizeNotification"
        :args="args"
      />
    </div>
  </span>
</template>

<script>
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Quality III",
    //
    "name": "quality-3",
    "components": {
      "d3-line-plot": LinePlot,
      "no-data": NoData,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "dataAvailable": function(){
        return selectData(this.data) != null;
      },
      "ffqData": function () {
        const data = selectData(this.data)["FFQ"];
        const x = rangeByStep(0, data[0].length, 1);
        return data.map((values, index) => ({
          "label": "Cycle " + index,
          "color": null,
          "y": values,
          "x": x
        }));
      },
      "lfqData": function () {
        const data = selectData(this.data)["LFQ"];
        const x = rangeByStep(0, data[0].length, 1);
        return data.map((values, index) => ({
          "label": "Cycle " + index,
          "color": null,
          "y": values,
          "x": x
        }));
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function() {
        const options = selectData(this.options);
        return {
          "useFocus": false,
          "yScale": {
            "useScientificNotation": true
          },
          "margin": options["margin"]
        };
      },
    }
  };

  function selectData(data) {
    return data["quality-3"];
  }

  function isParentDisplayingErrors(){
    return true;
  }
  
  function defaultTresholds(){
    return {
      "Bad": 0,
      "Ok": 0,
      "legend": "",
    }
  }
  function validateData(data, thresholds, forceCompute=false) {
    return {
      "status": STATUS_OK,
      "message": "computation not implemented",
    }
  }

</script>
