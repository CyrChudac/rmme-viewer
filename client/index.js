import Vue from "vue";
import App from "./application";

import "../styles/bootstrap.scss";

import {library} from "@fortawesome/fontawesome-svg-core";
import {
  //added by Skoda and might not be used anymore
  faPlus,
  faMinus,
  faAngleRight,
  faAngleLeft,

  //added by Skoda and still used for sure
  faCog,              // acgt-cycles left-view-menu
  faUpload,           // upload files
  faTrash,            // remove files

  //added by Chudacek
  faTimes,            // example closing button
  faTimesCircle,      // FAIL state sign
  faCheckCircle,      // PASS state sign
  faQuestionCircle    // WARN state sign
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

/*/
  import "./data.js";
/*/
  import "../test/data-fail.js"; // import "../test/data-pass.js"; //    import "../test/data-warn.js"; // 
/**/

// Add icons we need.
library.add([
  faPlus, faMinus, faCog, faUpload, faAngleRight, faAngleLeft, faTrash,

  faTimes, faTimesCircle, faCheckCircle, faQuestionCircle
]);

Vue.config.productionTip = false;


Vue.component("font-awesome-icon", FontAwesomeIcon);

/* eslint-disable no-new */
new Vue({
  "el": "#app",
  "render": (h) => h(App)
});
