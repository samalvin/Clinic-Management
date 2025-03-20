import { account, ID } from "@/app/appwrite";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67cfcdd3002a87ebea80");

const databases = new Databases(client);

const databaseId = "67cff8aa000593955ff2"; // Replace with your Appwrite Database ID
const collectionId = "67d29a49001becdcb053"; // Replace with your Appwrite Collection ID

// Login function
export const login = async (email: string, password: string) => {
  try {
    const result = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("UserEmail", email),
    ]);
    if (result.documents.length === 0) {
      throw new Error("User not found Please Register");
    }
    const user = result.documents[0];
    if (user.UserPassword === password) {
      console.log("Login successful");
      return user;
    } else {
      throw new Error("Invalid password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed");
  }
};

// Register function
export const register = async (email: string, password: string, role: string) => {
  const newEntry = {
    UserEmail: email,
    UserPassword: password,
    UserRole: role,
  };

  try {
    const createdDocument = await databases.createDocument(databaseId, collectionId, ID.unique(), newEntry);
    console.log("Created document:", createdDocument);
    return createdDocument; // Return the created document after successful registration
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error("Registration failed");
  }
};

// Logout function
export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Logout failed");
  }
};
