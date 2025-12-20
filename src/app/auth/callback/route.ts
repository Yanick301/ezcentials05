import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/account';
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    const type = requestUrl.searchParams.get('type'); // 'recovery' pour reset password

    // Si une erreur est présente dans l'URL, rediriger vers la page appropriée
    if (error) {
      console.error('Auth callback error:', error, errorDescription);
      // Si c'est une erreur de réinitialisation, rediriger vers forgot-password
      if (type === 'recovery') {
        return NextResponse.redirect(new URL(`/forgot-password?error=${encodeURIComponent(error)}`, requestUrl.origin));
      }
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin));
    }

    if (code) {
      const supabase = await createClient();
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!exchangeError && data?.session) {
        // Si c'est une réinitialisation de mot de passe, rediriger vers reset-password
        if (type === 'recovery' || next.includes('reset-password')) {
          return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
        }
        // Sinon, redirection normale après confirmation
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      } else {
        console.error('Error exchanging code for session:', exchangeError);
        // Si c'est une erreur de réinitialisation, rediriger vers forgot-password
        if (type === 'recovery') {
          return NextResponse.redirect(new URL('/forgot-password?error=auth_failed', requestUrl.origin));
        }
        return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
      }
    }

    // Si aucun code n'est présent, rediriger vers la page appropriée
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/forgot-password?error=no_code', requestUrl.origin));
    }
    return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    const requestUrl = new URL(request.url);
    const type = new URL(request.url).searchParams.get('type');
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/forgot-password?error=unexpected_error', requestUrl.origin));
    }
    return NextResponse.redirect(new URL('/login?error=unexpected_error', requestUrl.origin));
  }
}








