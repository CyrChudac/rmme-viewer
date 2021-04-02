<template>
  <div>
    <no-data v-if="!dataAvailable" />
    <d3-line-plot
      v-else
      :data="plotData"
      :text="plotText"
      :heightModifier="3"
      :resize-notification="resizeNotification"
      :args="args"
    />
  </div>
</template>

<script>
  import LinePlot from "../d3js/line-plot";
  import NoData from "../ui/no-data";

  import {rangeByStep, unifiedRound, smoothenArray} from "./views-utils";
  import {STATUS_OK, STATUS_WARNING, STATUS_INVALID} from "../data-status";

  export default {
    "validator": validateData,
    "thresholds": defaultTresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Insert size",
    //
    "name": "insert-size",
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
      "plotData": function () {
        const data = selectData(this.data);
        const options = selectData(this.options);
        const x = rangeByStep(0, data.count, 1);
        return [
          {
            "label": "All",
            "color": options.pairsTotal,
            "y": data.pairsTotal,
            "x": x,
          },
          {
            "label": "Inward",
            "color": options.inwardOrientedPairs,
            "y": data.inwardOrientedPairs,
            "x": x,
          },
          {
            "label": "Outward",
            "color": options.outwardOrientedPairs,
            "y": data.outwardOrientedPairs,
            "x": x,
          },
          {
            "label": "Other",
            "color": options.otherPairs,
            "y": data.otherPairs,
            "x": x,
          }
        ];
      },
      "plotText": function() {
        const data = selectData(this.data);
        return data["text"];
      },
      "args": function() {
        const options = selectData(this.options);
        return {
          "yScale": {
            "useScientificNotation": true
          },
          "margin": options["margin"],
        }
      },
    }
  };

  function selectData(data) {
    return data["insert-size"];
  }

  function isParentDisplayingErrors(){
    return true;
  }
  
  function defaultTresholds(){
    return {
      "Bad": 60,
      "Ok": 80,
      "legend": "minimal % of reads in " + (peakCountedPart * 100) + "% of the main peak and in ±" 
      + peakCountedPart * 100 / 2 + "% of main value",
    }
  }

  let peakCountedPart = 0.5;

  //algorithm finds local minimums to both sides from global maximum, ignore lets it ignore some small local minimums
  let ignore = 1.01;
  let quiet = true;
  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let usedString = areaUsedString;
      let usedArray = smoothenArray(data[usedString]);
      let maxIndex = indexOfMax(data[usedString]);
      if(!quiet){
        /**/
        console.log("usedArray:")
        for(let i = 0; i < usedArray.length; i++){
          console.log(usedArray[i]);
        }
        /**/
        console.log("wholeArea");
      }
      let wholeArea = areaUnderLineInRange(data, 0, data["insertSize"].length - 1);
      if(!quiet){
        console.log("areaAroundMainValue");
      }
      let areaValue = areaAroundMaxValue(data, maxIndex);
      if(!quiet){
        console.log("areaUnderMainPeak");
      }
      let areaPeak = areaUnderMainPeak(data, maxIndex, usedArray);
      let peakPercents = unifiedRound(areaPeak/wholeArea);
      let valuePercents = unifiedRound(areaValue/wholeArea);
      let percents = Math.min(peakPercents, valuePercents);

      let status;
      let message = "";
      if(percents >= thresholds["Ok"]/100){
        status = STATUS_OK;
      }else if (percents >= thresholds["Bad"]/100){
        message = messageFormating(peakPercents, valuePercents, thresholds["Ok"]/100, "suspecious");
        status = STATUS_WARNING;
      }
      else{
        message = messageFormating(peakPercents, valuePercents, thresholds["Bad"]/100, "wrong");
        status = STATUS_INVALID;
      }
      let result = {
        "status": status,
        "message": message,
      }
      data["status"] = result;
      return result;
    }
  }

  function messageFormating(peakPercents, valuePercents, maxPercents, state){
    let message = "Property is considered " + state + ", because ";
    if(peakPercents <= maxPercents && valuePercents < maxPercents){
      message += "reads in the main peak(" + peakPercents*100 + "%) and also reads around the main value("
        + valuePercents*100 + "%) are not enough.";
    }else if (peakPercents <= maxPercents){
      message += "there are not enough reads in the main peak(" + peakPercents*100 + "%)."
    }else{
      message += "there are not enough reads around the main value(" + valuePercents*100 + "%)."
    }
    return message;
  }

  function areaUnderMainPeak(data, maxIndex, usedArray){
    let prevLocMinIndex = 0;
    let nextLocMinIndex = usedArray.length - 1;
    for(let i = maxIndex - 1; i >= 0; i--){     //looking for local minimum before max
      let curr = unifiedRound(usedArray[i]);
      let prev = unifiedRound(usedArray[i + 1] * ignore);
      if( curr >= prev){
        prevLocMinIndex = i + 1;
        break;
      }
    }
    if(!quiet){
      console.log("max index = " + maxIndex);
      console.log("prevLocMinIndex = " + prevLocMinIndex);
    }
    for(let i = maxIndex + 1; i < usedArray.length - 1; i++){   //looking for local minimum after max
      let curr = unifiedRound(usedArray[i]);
      let prev = unifiedRound(usedArray[i - 1] * ignore);
      if(curr >= prev){
        nextLocMinIndex = i - 1;
        break;
      }
    }
    let minim = Math.round(maxIndex - peakCountedPart*(maxIndex - prevLocMinIndex));
    let maxim = Math.round(maxIndex + peakCountedPart*(nextLocMinIndex - maxIndex));
    if(!quiet){
      console.log("prev = " + prevLocMinIndex + ", next = " + nextLocMinIndex + 
        " => area(" + minim + ", " + maxim + ")");
    }
    return areaUnderLineInRange(data, minim, maxim);
  }

  function areaAroundMaxValue(data, maxIndex){
    let string = "insertSize";
    let max = data[string][maxIndex];
    let smaller = (max - data[string][0]) * (1 - peakCountedPart/2);
    let bigger = max + (data[string][data[string].length - 1] - max) * (1 - peakCountedPart/2);
    let smallerIndex = -1;
    let biggerIndex = -1;
    for(let i = 0; i < data[string].length; i++){ // TODO: find the indexes by binary search
      if(smallerIndex < 0){
        if(data[string][i] > smaller){
          smallerIndex = i;
        }
      }
      if(data[string][i] > bigger){
          biggerIndex = i;
          break;
      }
    }
    return areaUnderLineInRange(data, smallerIndex, biggerIndex);
  }

  //end is inclusive
  let areaUsedString = "inwardOrientedPairs";
  function areaUnderLineInRange(data, start, end){
    let result = 0;
    for(let i = start; i < end - 1; i++){
      let min = Math.min(data[areaUsedString][i], data[areaUsedString][i + 1]);
      let length = (data["insertSize"][i + 1] - data["insertSize"][i]);
      let add = min*length;
      add += Math.abs(data[areaUsedString][i] - data[areaUsedString][i + 1])*length / 2;
      result += add;
    }
    if(!quiet){
      console.log("RESULT = " + (result/(end-start)) + "*(" + end + "-" + start + ") = " + result);
    }
    return result;
  }

  //finds index of the maximum in an array
  function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

</script>
