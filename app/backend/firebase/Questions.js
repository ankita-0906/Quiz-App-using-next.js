import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./index";

function Questions(){
const question = collection(db, "questions");
console.log(question);
}
export default questions