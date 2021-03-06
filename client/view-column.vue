<template>
  <span
    :style="'width: ' + width + 'vw; position: relative;'"
    :class="'fixed-window view-column ' + borderClass()"
  >
    <font-awesome-icon
      v-show="showExample()"
      class="cross button"
      @click="resetExamples()"
      icon="times"
    />
    <div 
      class="rotated text-center"
    >
      <div class="upside-down">
        {{yCaption()}}
      </div>
    </div>
    <span>
      <summary-view
        v-if="activeView === 0"
        :data="data"
        :options="options"
      />
      <acgt-cycles-view
        v-else-if="activeView === 1"
        :data="data"
        :menu-data="menuData[1]"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <gc-content-view
        v-else-if="activeView === 2"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <indel-cycle-view
        v-else-if="activeView === 3"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <insert-size-view
        v-else-if="activeView === 4"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <quality-2-view
        v-else-if="activeView === 5"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <quality-3-view
        v-else-if="activeView === 6"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <gc-depth
        v-else-if="activeView === 7"
        :data="data"
        :options="options"
        :resize-notification="resizeNotification"
        class="inner-view-column"
      />
      <thresholds
        v-else-if="activeView === 8"
        :resize-notification="resizeNotification"
        :thresholdsVals="thresholdsValues"
        v-model="thresholdsValues"
      />
    </span>
    <div class="text-center">{{xCaption()}}</div>
    <div v-if="showExample()" class="text-center" style="margin-top: 1rem;">
      Example text to be shown under example graph. Because we all know that example without explanation is useless.
    </div>
    <div v-else-if="showResultMessage()" class="text-center" :style="'margin-top: 1rem; color: ' + resultColor()">
      {{ resultMessage() }}
    </div>
  </span>
</template>

<script>
  import SummaryView from "./views/summary-view";
  import AcgtCyclesView from "./views/acgt-cycles-view";
  import AcgtCyclesViewMenu from "./views/acgt-cycles-view-menu";
  import GcContentView from "./views/gc-content-view";
  import IndelCycleView from "./views/indel-cycles-view";
  import InsertSizeView from "./views/insert-size-view";
  import Quality2View from "./views/quality-2-view";
  import Quality3View from "./views/quality-3-view";
  import GcDepthView from "./views/gc-depth-view";
  import ThresholdsView from "./views/threshold-view";
  import gcContentViewVue from './views/gc-content-view.vue';
  import { selectColor } from './data-status';

  export default {
    "name": "view-column",
    "components": {
      "summary-view": SummaryView,
      "acgt-cycles-view": AcgtCyclesView,
      "acgt-cycles-view-menu": AcgtCyclesViewMenu,
      "indel-cycle-view": IndelCycleView,
      "insert-size-view": InsertSizeView,
      "gc-content-view": GcContentView,
      "quality-2-view": Quality2View,
      "quality-3-view": Quality3View,
      "gc-depth": GcDepthView,
      "thresholds": ThresholdsView,
    },
    "props": {
      "activeView": {"type": Number, "required": true},
      "activeExample": {"type": Number, "required": true},
      "data": {"type": Object, "required": true},
      "menuData": {"type": Object, "required": true},
      "options": {"type": Object, "required": true},
      "resizeNotification": {"type": Object, "required": true},
      "width": {"type": Number, "required": true},
      "thresholdsValues": {"type": Object, "required": true},
    },
    "methods": {
      "xCaption": function () {
        switch(this.activeView){
          case 1:
            return "Cycle";
          case 2:
            return "GC content";
          case 3:
            return "Cycle";
          case 4:
            return "Insert size";
          case 5:
            return "Cycle";
          case 6:
            return "Quality";
          case 7:
            return "% of mapped sequnces ordered by GC content";
          default:
            return this.defaultCaption("X");
        }
      },
      "yCaption": function () {
        switch(this.activeView){
          case 1:
            return "% representation of bases";
          case 2:
            return "Normalized frequency";
          case 3:
            return "Indel count";
          case 4:
            return "Number of pairs";
          case 5:
            return "Quality";
          case 6:
            return "Amount of bases";
          case 7:
            return "Mapped depth";
          default:
            return this.defaultCaption("Y");
        }
      },
      //inner function - it will not exist in the final 
      "defaultCaption": function (char){
        switch(this.activeView){
          case 0:
            return "";
          case 1:
            return "Cycles " + char + " caption";
          case 2:
            return "GC-Content " + char + " caption";
          case 3:
            return "Indel-cycle " + char + " caption";
          case 4:
            return "insert-size " + char + " caption";
          case 5:
            return "quality2 " + char + " caption";
          case 6:
            return "quality3 " + char + " caption";
          case 7:
            return "GC-depth " + char + " caption";
          case 8:
            return "";
        }
        return "Graph index is " + this.activeView + ". Something went wrong!";
      },
      "showExample": function (){
        return this.activeExample != -1;
      },
      "borderClass": function(){
        if(this.showExample()){
          return "bordered";
        }else{
          return "";
        }
      },
      "resetExamples": function (){
        this.$emit("reset-example");
      },
      "applyThresholds": function(){
        this.$emit("change-thresholds", this.thresholdsValues);
      },
      "activeViewComponent": function(){
        switch(this.activeView){
          case 0:
            return SummaryView;
          case 1:
            return AcgtCyclesView;
          case 2:
            return GcContentView;
          case 3:
            return IndelCycleView;
          case 4:
            return InsertSizeView;
          case 5:
            return Quality2View;
          case 6:
            return Quality3View;
          case 7:
            return GcDepthView;
          case 8:
            return ThresholdsView;
        }
      },
      "showResultMessage": function(){
        return this.activeViewComponent().parentDisplaysError();
      },
      "resultMessage": function(){
        return this.activeViewComponent().validator(this.data)["message"];
      },
      "resultColor": function(){
        return selectColor(this.activeViewComponent().validator(this.data)["status"]);
      }
    }
  }
</script>

<style scoped>

  .view-column{
    padding-left: 2rem;
    padding-top: 1.1rem;
    margin-top: 0.8rem;
    margin-left: 2.2rem;
    overflow: hidden;
  }

  .text-center{
    text-align: center;
  }
  .rotated{
    position: absolute;
    padding: 0%;
    margin: 0%;
    -webkit-transform-origin: 0% 100%;
    -ms-transform-origin: 0% 100%;
    transform-origin:0% 100%;
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .upside-down{
    text-align: right;
    padding: 0%;
    margin: 0%;
    margin-top: 70%;
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .bordered{
    border: 1px solid blue;
    box-shadow: 0 3px 6px 0 lightblue;
  }

  .inner-view-column{
    margin-left: 20px;
  }

  .cross{
    position: absolute;
    right: 0;
    box-shadow: 2px 2px 2px 0 red;
    top: 0;
    text-align: center;
    width: 1.4rem;
    height: 1.4rem;
    background-color: darkorange;
    color: red;
    cursor: pointer;
  }

  .cross:hover{
    background-color: red;
    color: darkred;
  }
</style>