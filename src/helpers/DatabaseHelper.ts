import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData, getDoc,
    getDocs, updateDoc, where,
} from "firebase/firestore";
import {IDatabaseMethods} from "@/src/helpers/interfaces/IDatabaseMethods";
import {db} from "../config/firebaseConfig";
import AppHelper from "@/src/helpers/AppHelper";
import AccountModel from "@/src/models/Account";
import {query} from "@firebase/database";

class DatabaseHelper<T extends DocumentData> implements IDatabaseMethods<T> {
    private readonly _collectionName: string;
    private readonly _reference: any;

    constructor(collectionName: string) {
        this._collectionName = collectionName;
        this._reference = collection(db, this._collectionName);
    }

    async add(document: T): Promise<string | null> {
        try {
            const docRef = await addDoc(this._reference, document);
            return docRef.id;
        } catch(error) {
            AppHelper.showJson("Error adding document: " + error, "error");
            return null;
        }
    }

    async update(id: string, newDocument: T): Promise<void> {
       try {
           const docRef = doc(db, this._collectionName, id);
           await updateDoc(docRef, newDocument);
       } catch (error) {
           AppHelper.showJson("Error updating document: " + error, "error");
       }
    }

    async delete(id: string): Promise<void> {
        try {
            await deleteDoc(doc(db, this._collectionName, id));
        } catch (error) {
            AppHelper.showJson("Error removing document: " + error, "error");
        }
    }

    async getAll(): Promise<T[] | null> {
        try {
            const querySnapshot = await getDocs(this._reference);
            const documents: T[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];

            return documents;
        } catch(error) {
            AppHelper.showJson("Error getAll document: " + error, "error");
            return null;
        }
    }

    async getByField(fieldName: string, value: any): Promise<T | null> {
        try {
            const q = query(this._reference, where(fieldName, "==", value));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const document: T = {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data(),
            } as T;

            return document; // Return the first document found
        } catch (error) {
            AppHelper.showJson("Error getByField document: " + error, "error");
            return null;
        }
    }

    async get(id: string): Promise<T | null> {
        try {
            const docRef = doc(db, this._collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as T;
            } else {
                return null;
            }
        } catch(error) {
            AppHelper.showJson("Error get document: " + error, "error");
            return null;
        }
    }

    async findByEmail(email: string): Promise<T | null> {
        try {
            const q = query(this._reference, where('email', "==", email));
            // @ts-ignore
            const querySnapshot = await getDocs(q);

            if (querySnapshot.docs.length !== 0) {
                const docSnap = querySnapshot.docs[0];
                return docSnap.data() as T;
            } else {
                return null;
            }
        } catch(error) {
            AppHelper.showJson("Error findByEmail document: " + error, "error");
            return null;
        }
    }
}

export default DatabaseHelper;