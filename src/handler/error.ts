function handleError(error: { code: string; message: string }) {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Email is invalid.';
        case 'auth/invalid-credential':
            return 'Wrong password or email';
        case 'auth/missing-email':
            return 'Email cannot be left blank';
        case 'auth/wrong-password':
            return 'Wrong password.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/email-already-in-use':
            return 'Email already in use'
        default:
            return error.message;
    }
}

export { handleError }