import "vue-select/dist/vue-select.css";

import 'bootstrap'

import "./assets/fonts/simple-line-icons/css/simple-line-icons.css"
import "./assets/fonts/iconsmind-s/css/iconsminds.css" 

// import { defaultColor } from "./constants/config";
/*  if you want use single color theme

- ColorSwitcher component remove in 'src/App.vue' file.
- Remove multicolor section in current file
- Uncomment the two lines below

import "./assets/css/sass/themes/piaf.light.orange.scss";

*/
import app from "./main";

app.mount("#app")

/* if you want single color remove this section:multicolor */
/*var color = defaultColor;

if (localStorage.getItem("themeColor")) {
  color = localStorage.getItem("themeColor");
}

let render = () => {
  import("./assets/css/sass/themes/piaf." + color + ".scss").then(() =>
    require("./main")
  );
};

render();*/
/* if you want single color remove this section:multicolor */