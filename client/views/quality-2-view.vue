<template>
  <span>
    <no-data v-if="!dataAvailable" />
    <div
      v-else
    >
      <d3-line-area-plot
        :line="ffqLineData"
        :area="ffqAreaData"
        :text="plotText"
        :heightModifier=1.7
        :resize-notification="resizeNotification"
        :args="args"
      />
      <d3-line-area-plot
        :line="lfqLineData"
        :area="lfqAreaData"
        :heightModifier=1.7
        :resize-notification="resizeNotification"
        :args="args"
      />
    </div>
  </span>
</template>

<script>
  import LineAreaPlot from "../d3js/line-area-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep, unifiedRound} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Quality II",
    //
    "name": "quality-2",
    "components": {
      "d3-line-area-plot": LineAreaPlot,
      "no-data": NoData,
    },
    "props": {
      "data": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "require": true},
    },
    "computed": {
      "dataAvailable": function () {
        return selectData(this.data) != null;
      },
      "ffqLineData": function () {
        const data = selectData(this.data)["FFQ"];
        const options = selectData(this.options)["FFQ"];
        return [
          {
            "label": "Median",
            "color": options.median,
            "y": data.median,
            "x": data.bins,
          }, {
            "label": "Mean",
            "color": options.mean,
            "y": data.mean,
            "x": data.bins,
          }
        ];
      },
      "ffqAreaData": function () {
        const data = selectData(this.data)["FFQ"];
        const options = selectData(this.options)["FFQ"];
        return [
          {
            "label": "Percentile",
            "color": options.percentile,
            "y-high": data["percentile-75"],
            "y-low": data["percentile-25"],
            "x": data.bins,
          }
        ];
      },
      "lfqLineData": function () {
        const data = selectData(this.data)["LFQ"];
        const options = selectData(this.options)["LFQ"];
        return [
          {
            "label": "Median",
            "color": options.median,
            "y": data.median,
            "x": data.bins,
          }, {
            "label": "Mean",
            "color": options.mean,
            "y": data.mean,
            "x": data.bins,
          }
        ];
      },
      "lfqAreaData": function () {
        const data = selectData(this.data)["LFQ"];
        const options = selectData(this.options)["LFQ"];
        return [
          {
            "label": "Percentile",
            "color": options.percentile,
            "y-high": data["percentile-75"],
            "y-low": data["percentile-25"],
            "x": data.bins,
          }
        ];
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function () {
        const options = selectData(this.options);
        return {
          "useFocus": true,
          "yRange": {
            "max": 50,
            "min": 0,
          },
          "margin": options["margin"],
        }
      },
    }
  };

  function selectData(data) {
    return data["quality-2"];
  }

  function isParentDisplayingErrors(){
    return true;
  }
  
  function defaultTresholds(){
    return {
      "Bad": 15,
      "Ok": 8,
      "legend": "maximal difference between maximum and minimum in the graph",
    }
  }

  let quiet = true;
  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let min = Math.min(...data["FFQ"].mean, ...data["FFQ"].median,
                        ...data["LFQ"].mean, ...data["LFQ"].median); 
      min = unifiedRound(min);
      let max = Math.max(...data["FFQ"].mean, ...data["FFQ"].median,
                        ...data["LFQ"].mean, ...data["LFQ"].median); 
      max = unifiedRound(max);

      let diff = max - min;
      diff = unifiedRound(diff);

      if(!quiet){
        console.log("quiality-2 diff = " + diff);
      }

      let status;
      let message;
      if(diff < thresholds["Ok"]){
        message = "";
        status = STATUS_OK;
      }else{
        let state;
        if (diff < thresholds["Bad"]){
          state = "suspecious";
          status = STATUS_WARNING;
        }else{
          state = "wronng";
          status = STATUS_INVALID;
        }
        message = "Property is considered " + state + ", because difference(" + diff + 
          ") between maximal(" + max + ") and minimal(" + min + ") value is too large."
      }
      let result = {
        "status": status,
        "message": message,
      }
      data["status"] = result;
      return result;
    }
  }

</script>
