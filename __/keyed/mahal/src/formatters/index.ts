import { Mahal } from "mahal";
import { imgPath } from "./img_path";

export function registerGlobalFormatter(app: Mahal) {
    app.extend.formatter("imgPath", imgPath);
}