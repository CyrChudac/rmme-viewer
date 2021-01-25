import SummaryView from "./views/summary-view";
import AcgtCyclesView from "./views/acgt-cycles-view";
import GcConventView from "./views/gc-content-view";
import IndelCycleView from "./views/indel-cycles-view";
import InsertSizeView from "./views/insert-size-view";
import Quality2View from "./views/quality-2-view";
import Quality3View from "./views/quality-3-view";
import GcDepthView from "./views/gc-depth-view";
import ThresholdsView from "./views/threshold-view";
import {getNegativeExamples} from "./negative-data-examples";

const viewsList = [
  {
    "validator": SummaryView.validator,
    "thresholds": SummaryView.thresholds,
    "label": SummaryView.label,
    "examples": [],
  }, {
    "validator": AcgtCyclesView.validator,
    "thresholds": AcgtCyclesView.thresholds,
    "label": AcgtCyclesView.label,
    "examples": getNegativeExamples("acgt-cycles"),
    "menuData": AcgtCyclesView.menuData,
  }, {
    "validator": GcConventView.validator,
    "thresholds": GcConventView.thresholds,
    "label": GcConventView.label,
    "examples": getNegativeExamples("gc-content"),
  }, {
    "validator": IndelCycleView.validator,
    "thresholds": IndelCycleView.thresholds,
    "label": IndelCycleView.label,
    "examples": getNegativeExamples("indel-cycles"),
  }, {
    "validator": InsertSizeView.validator,
    "thresholds": InsertSizeView.thresholds,
    "label": InsertSizeView.label,
    "examples": getNegativeExamples("insert-size"),
  }, {
    "validator": Quality2View.validator,
    "thresholds": Quality2View.thresholds,
    "label": Quality2View.label,
    "value": 5,
    "examples": getNegativeExamples("quality-2"),
  }, {
    "validator": Quality3View.validator,
    "thresholds": Quality3View.thresholds,
    "label": Quality3View.label,
    "examples": getNegativeExamples("quality-3"),
  }, {
    "validator": GcDepthView.validator,
    "thresholds": GcDepthView.thresholds,
    "label": GcDepthView.label,
    "examples": getNegativeExamples("gc-depth"),
  }, {
    "validator": ThresholdsView.validator,
    "thresholds": ThresholdsView.thresholds,
    "label": ThresholdsView.label,
    "examples": [],
  }
];

export default viewsList;