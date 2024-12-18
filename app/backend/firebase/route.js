

import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./index";

const collectionNames = ["question1", "question2", "question3", "question4", "question5"];

export const GET = async () => {
  try {
    let data = [];

    for (const name of collectionNames) {
      const questionRef = collection(db, name);
      const querySnapshot = await getDocs(questionRef);
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
       // console.log(doc.data);
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
};
