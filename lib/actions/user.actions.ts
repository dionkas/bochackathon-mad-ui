import { auth, firebaseDb } from "@/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore/lite";

type LoginInfo = {
  email: string;
  password: string;
};

const formatAdmin = (admin: UserCredential) => ({
  email: admin?.user.email,
  displayName: admin?.user?.displayName,
  emailVerified: admin?.user?.emailVerified,
  uid: admin?.user?.uid,
});
export async function customSignIn({ email, password }: LoginInfo) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((admin) => {
      return {
        data: formatAdmin(admin),
        success: true,
      };
    })
    .catch((error) => {
      return {
        data: error?.message || "Something went wrong..",
        success: false,
      };
    });
}

export async function customLogOut() {
  return signOut(auth)
    .then((res) => {
      console.info("res => ", res);
    })
    .catch((error) => {
      console.info("error => ", error.message);
    });
}

export async function fetchCollection(storeId: string, dbCollection: string) {
  const adminsCollection = await collection(firebaseDb, dbCollection);
  const adminsSnapshot = await getDocs(adminsCollection);
  const test = adminsSnapshot.docs
      .map((doc) => doc.data());
  console.info("test => ", test);
  return adminsSnapshot.docs
    .filter((doc) => doc.id === storeId)
    .map((doc) => doc.data())[0];
}

export async function fetchInvoices(userID: string, dbCollection: string) {
  const adminsCollection = await collection(firebaseDb, dbCollection);
  const adminsSnapshot = await getDocs(adminsCollection);
  return adminsSnapshot.docs
      .map((doc) => doc.data())
      .filter((invoice) => invoice.userId === userID);
}
