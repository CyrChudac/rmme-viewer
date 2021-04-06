import Vue from "vue";
import App from "./application";

import "../styles/bootstrap.scss";

import {library} from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faMinus,
  faEye,
  faCog,
  faUpload,
  faAngleRight,
  faAngleLeft,
  faTrash,

  faTimes,
  faTimesCircle,
  faCheckCircle,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

/**/
  import "./data.js";
/*/
  import "../test/data-pass.js";
/**/

// Add icons we need.
library.add([
  faPlus, faMinus, faEye, faCog, faUpload, faAngleRight, faAngleLeft, faTrash,

  faTimes, faTimesCircle, faCheckCircle, faQuestionCircle
]);

Vue.config.productionTip = false;


Vue.component("font-awesome-icon", FontAwesomeIcon);

/* eslint-disable no-new */
new Vue({
  "el": "#app",
  "render": (h) => h(App)
});
