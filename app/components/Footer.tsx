import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          Developed by{' '}
          <a
            href="https://github.com/connor224"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-200"
          >
            connor224
          </a>
        </p>
        <p>
          <Link href="/privacy" className="underline hover:text-blue-200 mr-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline hover:text-blue-200">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  )
}

