import { NextResponse } from "next/server";
// Remove bcrypt import
// We'll use a simple but reasonably secure hash function for the browser

// Simple hash function - in a real app, use something more secure
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function POST(request: Request) {
  try {
    console.log("Signup API called");
    const { name, email, password } = await request.json();
    console.log("Received signup request for email:", email);

    // Validate the data
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Hash the password using our browser-compatible function
    const hashedPassword = await hashPassword(password);
    console.log("Generated password hash:", hashedPassword);

    // Create a user object that can be stored in localStorage
    // In a real app, you would also save this to a database
    const user = {
      id: Date.now().toString(), // Simple ID generation
      name,
      email,
      password: hashedPassword, // Storing hashed password
      picture: "", // No picture by default
      createdAt: new Date().toISOString()
    };
    
    console.log("Created user object:", { ...user, password: "[HIDDEN]" });
    
    // Success response with the user data (with password)
    return NextResponse.json(
      { 
        message: "User registered successfully",
        user // Include the full user with password for local storage
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "An error occurred while registering the user" },
      { status: 500 }
    );
  }
} 