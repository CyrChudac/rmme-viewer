<template>
  <div
  style="height: 250px;"
  >
    <no-data v-if="!dataAvailable" />
    <span v-else>
      <button 
        style="margin-bottom: 1rem;" 
        @click="currView = (currView + 1) % 2"
      >
        Mode
      </button>
      <div
        v-if="currView === 0"
      >
        <div
          class="summary-table"
        >
          <table>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>{{"% of '" + currDividor + "'"}}</th>
            </tr>
            <tr
              v-for="(value, index) in included"
              :key="value"
              :style="'color: ' + itemColor(value)"
            >
              <td
                @click="setDividor(index)"
                @mouseenter="hoveredOver = index"
                :style="setCursor(index)"
              >
                {{ value["string"] }}
              </td>
              <td class="value-cell">
                {{ formatNumber(data.summary[value["string"]]) }}
              </td>
              <td style="padding-left: 1rem" class="value-cell">
                {{ percents(index) }}
              </td>
            </tr>
          </table>
        </div>
        <div style="padding-top: 1rem; text-align: center; color: gray;">
          Hint: click on a name to change the percents
        </div>
        <div v-if="hoveredOver < 0" style="padding-top: 1rem; text-align: center; color: gray;">
          Hint: Hover over a property name to see it's hint.
        </div>
        <div v-if="hoveredOver >= 0" style="padding-top: 1rem; text-align: center;">
          Hint string of {{included[hoveredOver]["string"]}} not set.
        </div>
      </div>
      <div
        v-else-if="currView === 1"
        class="summary-table"
      >
        <table >
          <tr>
            <th>Property</th>
            <th>Displayed</th>
            <th>Show %</th>
          </tr>
          <tr
            v-for="(value, index) in data.summary"
            :key="index"
          >
            <td>
              {{ index }}
            </td>
            <td 
              class="value-cell"
            >
              <input 
                type="checkbox" 
                :ref="'checkbox_' + index"
                :checked="includedIncludes(index)"
                @click="includeCheckChanged(index)"
              >
            </td>
            <td style="padding-left: 1rem" class="value-cell">
              <input
                type="checkbox" 
                :ref="'checkbox_perc_' + index"
                :checked="percentVal(index)"
                @click="percentsCheckChanged(index, $event)"
              >
            </td>
          </tr>
        </table>
      </div>
      <div v-else>Internal Error: no data for current inner summary view.</div>
    </span>
  </div>
</template>

<script>
  let quiet = true;

  import NoData from "../ui/no-data";
  import { STATUS_OK, STATUS_WARNING, selectColor, STATUS_INVALID } from '../data-status';
  import { unifiedRound } from './views-utils';

  export default {
    "validator": validateData,
    "thresholds": defaultThresholds,
    "parentDisplaysError": isParentDisplayingErrors,
    "label": "Summary",
    //
    "name": "summary-view",
    "components": {
      "no-data": NoData,
    },
    "data": () => ({
      "included": defaultIncluded(),
      "currDividor": "sequences",
      "currView": 1,
      "hoveredOver": -1,
    }),
    "props": {
      "data": {"type": Object, "required": true}
    },
    "computed": {
      "dataAvailable": function() {
        return this.data.summary;
      },
      "total": function () {
        return this.data.summary["sequences"];
      },
      "filteredSequences": function () {
        return this.data.summary["filtered sequences"];
      },
      "nonPrimaryAlignments": function () {
        return this.data.summary["non-primary alignments"];
      },
      "readsDuplicated": function () {
        return this.data.summary["reads duplicated"];
      },
      "readsMapped": function () {
        return this.data.summary["reads mapped"];
      },
      "readsMQ0": function () {
        return this.data.summary["reads MQ0"];
      },
      "averageLength": function () {
        return this.data.summary["average length"];
      }
    },
    "methods": {
      "includedIncludes": function(string){
        var res = this.included.find((val) => val["string"] === string);
        if(!quiet){
          if(res != undefined)
            console.log("includedIncludes - " + string);
        }
        return res;
      },
      "formatNumber": function (number) {
        number = Math.round(number * 1000)/1000;
        if (Number.isInteger) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return number;
        }
      },
      "itemColor": function(itemName){
        if(this.data["status"] && this.data["status"]["message"].includes(itemName)){
          return selectColor(STATUS_INVALID);
        }else{
          return selectColor(undefined);
        }
      },
      "setDividor": function(index){
        if(!this.included[index]["noPercents"]){
          this.currDividor = this.included[index]["string"];
        }
      },
      "percents": function(index){
        if(!this.included[index]["noPercents"]){
          return unifiedRound(this.data.summary[this.included[index]["string"]] * 100
          / this.data.summary[this.currDividor]);
        }else{
          return "";
        }
      },
      "setCursor": function(index){
        if(!this.included[index]["noPercents"]){
          return "cursor: pointer";
        }else{
          return "";
        }
      },
      "includeCheckChanged": function(string){
        let checked = this.$refs["checkbox_" + string][0].checked;
        console.log(checked);
        if(checked){
          this.includeCheck(string);
        }else{
          this.includeUncheck(string);
        }
      },
      "includeCheck": function(string){
        this.included.push({
          "string": string
        });
      },
      "includeUncheck": function(string){
        this.included = this.included.filter((s) => s["string"] != string);
      },
      "percentsCheckChanged": function(string){
        let checked = this.$refs["checkbox_perc_" + string][0].checked;
        if(checked){
          this.percentsCheck(string);
        }else{
          this.percentsUncheck(string);
        }
      },
      "percentsCheck": function(string){
        if(!quiet){
          console.log("percentCheck");
        }
        let including = this.includedIncludes(string);
        including["noPercents"] = undefined;
      },
      "percentsUncheck": function(string){
        if(!quiet){
          console.log("percentUncheck");
        }
        let including = this.includedIncludes(string);
        including["noPercents"] = true;
      },
      "percentVal": function(string){
        let including = this.includedIncludes(string);
        return including != undefined && !including["noPercents"];
      }
    }
  };

  function defaultIncluded(){
    return [
        {
          "string": "sequences"
        },
        {
          "string": "reads mapped"
        },
        {
          "string": "reads mapped and paired"
        },
        {
          "string": "reads properly paired"
        },
        {
          "string": "reads MQ0"
        },
        {
          "string": "reads duplicated"
        },
        {
          "string": "total length",
          "noPercents": true
        },
        {
          "string": "bases mapped",
          "noPercents": true
        },
        {
          "string": "error rate",
          "noPercents": true
        },
        {
          "string": "average length",
          "noPercents": true
        },
        {
          "string": "average quality",
          "noPercents": true
        },
      ]
  }

  function selectData(data){
    return data.summary;
  }

  function isParentDisplayingErrors(){
    return false;
  }

  function defaultThresholds(){
    return {
      "Bad": "-",
      "Ok": "-",
      "legend": ""
    }
  }

  //ok if mapped > 90%, only 02% error ratio, mapped and paired > 80%
  function validateData(data, thresholds, forceCompute=false) {
    data = selectData(data);
    if(data["status"] && !forceCompute){
      return data["status"];
    }else{
      let status;
      let message = "";
      if(data["bases mapped (cigar)"] / data["total length"] < 0.9){
        message += "reads mapped\n";
      }
      if(data["error rate"] > 0.0002){
        message += "error rate\n";
      }
      if(data["reads duplicated"]/data["sequences"] > 0.05){
        message += "reads duplicated\n";
      }
      if(data["reads mapped and paired"]/data["sequences"] < 0.8){
        message += "reads mapped and paired\n";
      }
      if(message != ""){
        status = STATUS_WARNING;
      }else{
        status = STATUS_OK;
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

<style scoped>
  .summary-table {
    margin-left: 2rem;
    overflow: auto;
    max-height: 450px;
  }

  .value-cell {
    text-align: right;
  }
</style>