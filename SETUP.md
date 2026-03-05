# Next.js 14 Production-Ready Authentication & Blog System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Directory Structure
Run these commands in PowerShell or create folders manually:

```powershell
New-Item -ItemType Directory -Force -Path lib
New-Item -ItemType Directory -Force -Path models
New-Item -ItemType Directory -Force -Path app\api\auth\login
New-Item -ItemType Directory -Force -Path app\api\auth\register
New-Item -ItemType Directory -Force -Path app\api\auth\logout
New-Item -ItemType Directory -Force -Path app\api\posts\create
New-Item -ItemType Directory -Force -Path app\api\posts\delete
New-Item -ItemType Directory -Force -Path app\api\posts\seed
New-Item -ItemType Directory -Force -Path app\login
New-Item -ItemType Directory -Force -Path app\register
New-Item -ItemType Directory -Force -Path app\dashboard
New-Item -ItemType Directory -Force -Path app\blog
New-Item -ItemType Directory -Force -Path app\admin
```

### 3. Create Files

#### lib/db.js
```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

#### lib/auth.js
```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

#### models/User.js
```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

#### models/Post.js
```javascript
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
```

#### app/api/auth/register/route.js
```javascript
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    return NextResponse.json({ 
      message: 'User created successfully',
      user: { id: user._id, email: user.email, role: user.role }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
```

#### app/api/auth/login/route.js
```javascript
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ 
      userId: user._id.toString(), 
      email: user.email, 
      role: user.role 
    });

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user._id, email: user.email, role: user.role }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
```

#### app/api/auth/logout/route.js
```javascript
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
```

#### app/api/posts/create/route.js
```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.create({
      title,
      content,
      author: decoded.userId,
    });

    return NextResponse.json({ 
      message: 'Post created successfully',
      post 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
```

#### app/api/posts/delete/route.js
```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
```

#### app/api/posts/seed/route.js
```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export async function POST() {
  try {
    await connectDB();

    const existingPosts = await Post.countDocuments();
    if (existingPosts >= 100) {
      return NextResponse.json({ message: 'Posts already seeded' });
    }

    const posts = [];
    for (let i = 1; i <= 120; i++) {
      posts.push({
        title: `Blog Post ${i}`,
        content: `This is the content for blog post number ${i}. It contains interesting information about various topics.`,
      });
    }

    await Post.insertMany(posts);

    return NextResponse.json({ message: '120 posts created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed posts' }, { status: 500 });
  }
}
```

#### app/register/page.js
```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
```

#### app/login/page.js
```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
```

#### app/dashboard/page.js
```javascript
'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. You are logged in!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/blog" style={{ marginRight: '15px' }}>View Blog</a>
        <a href="/admin" style={{ marginRight: '15px' }}>Admin Panel</a>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
```

#### app/blog/page.js
```javascript
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Link from 'next/link';

const POSTS_PER_PAGE = 10;

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;

  if (page < 1) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Invalid Page</h1>
        <p>Page number must be positive.</p>
        <Link href="/blog?page=1">Go to page 1</Link>
      </div>
    );
  }

  await connectDB();

  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (page > totalPages && totalPages > 0) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Page Not Found</h1>
        <p>This page does not exist.</p>
        <Link href={`/blog?page=${totalPages}`}>Go to last page</Link>
      </div>
    );
  }

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE)
    .lean();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Blog Posts</h1>
      <p>Total Posts: {totalPosts}</p>
      
      <div style={{ marginTop: '30px' }}>
        {posts.map((post) => (
          <div key={post._id.toString()} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>Posted: {new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {page > 1 && (
          <Link href={`/blog?page=${page - 1}`} style={{ padding: '8px 12px', border: '1px solid #ddd' }}>
            Previous
          </Link>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`/blog?page=${pageNum}`}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              backgroundColor: pageNum === page ? '#0070f3' : 'white',
              color: pageNum === page ? 'white' : 'black',
            }}
          >
            {pageNum}
          </Link>
        ))}

        {page < totalPages && (
          <Link href={`/blog?page=${page + 1}`} style={{ padding: '8px 12px', border: '1px solid #ddd' }}>
            Next
          </Link>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link href="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}
```

#### app/admin/page.js
```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [postId, setPostId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/posts/delete?id=${postId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Post deleted successfully');
        setPostId('');
      } else {
        setMessage(data.error || 'Failed to delete post');
      }
    } catch (err) {
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Panel</h1>
      <p>Only admins can access this page and delete posts.</p>

      <form onSubmit={handleDelete} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Post ID to Delete:</label>
          <input
            type="text"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'Deleting...' : 'Delete Post'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <a href="/blog" style={{ marginRight: '15px' }}>View Blog</a>
        <a href="/dashboard" style={{ marginRight: '15px' }}>Dashboard</a>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
```

### 4. Start MongoDB
Make sure MongoDB is running on localhost:27017

### 5. Run the Application
```bash
npm run dev
```

### 6. Seed Database
Visit http://localhost:3000/api/posts/seed (POST request) to create 120 dummy blog posts.

### 7. Test the Application
1. Register a user at /register (create both user and admin accounts)
2. Login at /login
3. Access /dashboard (protected)
4. View /blog with pagination
5. Access /admin (admin only)

## Features Implemented
✅ JWT Authentication with HTTP-only cookies
✅ Middleware-based route protection
✅ Role-based access control (user/admin)
✅ MongoDB with Mongoose
✅ Password hashing with bcrypt
✅ Pagination system (10 posts per page)
✅ Protected API routes
✅ Server components for blog
✅ Client components for forms
✅ Logout functionality
✅ Loading states
✅ Error handling
✅ Environment variables
✅ Production-ready code structure
