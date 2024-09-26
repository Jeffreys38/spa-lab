import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

export interface IDatabaseMethods<T> {
    // Return id of document
    add(document: T): Promise<string | null>;

    update(id: string, newDocument: T): Promise<void>;

    delete(id: string): Promise<void>;

    getAll(): Promise<T[] | null>;

    get(id: string): Promise<T | null>;
}