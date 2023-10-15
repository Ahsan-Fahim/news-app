import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    //   return NextResponse.redirect(new URL('/home', request.url))
    const token = request.cookies.get('accessToken')?.value
    console.log("abcd", token)
    if (!token || token == undefined) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/apps/:path*'],
}