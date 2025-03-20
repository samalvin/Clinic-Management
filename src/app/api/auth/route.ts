import { NextRequest, NextResponse } from 'next/server';
import { ID } from "@/app/appwrite";
import { Client, Account } from 'appwrite';  

// Set up Appwrite client and account service
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67cfcdd3002a87ebea80");

const account = new Account(client);

// Handle POST requests (Login, Register, Logout)
export async function POST(req: NextRequest) {
  const { action, email, password, role } = await req.json();

  switch (action) {
    case 'login':
      return handleLogin(email, password);
    case 'register':
      return handleRegister(email, password, role);
    case 'logout':
      return handleLogout();
    default:
      return NextResponse.json({ message: 'Action not recognized' }, { status: 400 });
  }
}

// Handle GET requests (Check if the user is authenticated)
export async function GET(req: NextRequest) {
  try {
    const session = await account.getSession('current');  // Check for active session
    return NextResponse.json({ message: 'User is logged in', session }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'No active session' }, { status: 401 });
  }
}

// Handle login logic
// const handleLogin = async (email: string, password: string) => {
//   try {
//     // Step 1: Create session with Appwrite
//     const session = await account.createEmailPasswordSession(email, password);

//     // Step 2: Ensure user has an active session
//     const currentSession = await account.getSession('current');
//     debugger
//     if (!currentSession) {
//       return NextResponse.json({ message: 'Login failed: No active session found' }, { status: 401 });
//     }

//     // Step 3: Generate JWT using Appwrite's createJWT method
//     const jwt = await account.createJWT(); // Optional: Set expiry as needed

//     return NextResponse.json({ message: 'Login successful', session: currentSession, jwt }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ message: 'Login failed: ' + error.message }, { status: 500 });
//   }
// };

// Handle login logic
const handleLogin = async (email: string, password: string) => {
  try {
    // Step 1: Create session with Appwrite
    const session = await account.createEmailPasswordSession(email, password);

    // Step 2: Ensure user has an active session
    const currentSession = await account.getSession('current');
    console.log(currentSession)
    if (!currentSession) {
      return NextResponse.json({ message: 'Login failed: No active session found' }, { status: 401 });
    }

    // Step 3: Check if the user has the correct role
    const user : any = await account.get(); // Get user details
    if (user.role === 'guests') {
      return NextResponse.json({ message: 'Login failed: User does not have sufficient permissions' }, { status: 403 });
    }

    // Step 4: Generate JWT using Appwrite's createJWT method
    const jwt = await account.createJWT(); // Optional: Set expiry as needed

    return NextResponse.json({ message: 'Login successful', session: currentSession, jwt }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Login failed: ' + error.message }, { status: 500 });
  }
};



// Handle registration logic
const handleRegister = async (email: string, password: string, role: string) => {
  try {
    // Create the user in Appwrite
    const user = await account.create(ID.unique(), email, password);
    
    // If you want to store additional user information (like role) in your database
    const newUser = {
      email: email,
      role: role,
      userId: user.$id,
    };

    return NextResponse.json({ message: 'User registered successfully', user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Registration failed: ' + error.message }, { status: 500 });
  }
};

// Handle logout logic
const handleLogout = async () => {
  try {
    await account.deleteSession('current');  // Delete current session
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Logout failed: ' + error.message }, { status: 500 });
  }
};
