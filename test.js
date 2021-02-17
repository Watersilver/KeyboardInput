import KB from "./Keyboard.js";

const kb = new KB();

const crDiv = () => document.createElement("div");

const keysMemory = 10;
const latestPressedKeys = [], latestReleasedKeys = [];

const main = document.getElementsByTagName("main")[0];

const d1 = crDiv(), d2 = crDiv(), d3 = crDiv();
let str1 = "", str2 = "", str3 = "";
let str1Prev = str1, str2Prev = str2, str3Prev = str3;

main.append(d1, d2, d3);

setInterval(() => {
  kb.update();
  
  kb.getPressedKeys().forEach(key => latestPressedKeys.push(key));
  while (latestPressedKeys.length > keysMemory) latestPressedKeys.shift();
  
  kb.getReleasedKeys().forEach(key => latestReleasedKeys.push(key));
  while (latestReleasedKeys.length > keysMemory) latestReleasedKeys.shift();
})

const draw = () => {
  str1 = "";
  str1 += Array.from(kb.getHeldKeys()).join("<br>");

  str2 = "";
  str2 += latestPressedKeys.join("<br>");

  str3 = "";
  str3 += latestReleasedKeys.join("<br>");

  if (str1Prev !== str1) d1.innerHTML = str1;
  if (str2Prev !== str2) d2.innerHTML = str2;
  if (str3Prev !== str3) d3.innerHTML = str3;

  str1Prev = str1, str2Prev = str2, str3Prev = str3;

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);