import Link from 'next/link';

// app/404.tsx
const Custom404 = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg">Oops! The page you are looking for does not exist.</p>
            <Link href="/">
                <span className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded cursor-pointer">Go Home</span>
            </Link>
        </div>
    );
};

export default Custom404;
