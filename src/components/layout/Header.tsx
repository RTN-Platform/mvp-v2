
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-4xl">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-nature-800">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 4C19.6569 4 21 5.34315 21 7V13C21 14.6569 19.6569 16 18 16C16.3431 16 15 14.6569 15 13V7C15 5.34315 16.3431 4 18 4Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157L18 12.3431L21.1716 9.17157C22.7337 7.60948 25.2663 7.60948 26.8284 9.17157C28.3905 10.7337 28.3905 13.2663 26.8284 14.8284L18 23.6569L9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.5 21.5C8.5 20.9477 8.94772 20.5 9.5 20.5H26.5C27.0523 20.5 27.5 20.9477 27.5 21.5V30C27.5 30.5523 27.0523 31 26.5 31H9.5C8.94772 31 8.5 30.5523 8.5 30V21.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <div className="font-serif text-sm text-nature-700">RESORT TO</div>
              <div className="font-serif font-bold text-xl leading-none text-nature-900">
                NATURE
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/profile"
            className="font-medium text-gray-700 hover:text-nature-700"
          >
            Profile
          </Link>
          <Link
            to="/tribe"
            className="font-medium text-gray-700 hover:text-nature-700"
          >
            Tribe
          </Link>
          <Link
            to="/experiences"
            className="font-medium text-gray-700 hover:text-nature-700"
          >
            Experiences
          </Link>
          <button className="text-gray-700 hover:text-nature-700">
            <Search size={20} />
          </button>
        </nav>

        <div>
          <Button
            variant="outline"
            className="border-nature-600 text-nature-700 hover:text-nature-800 hover:bg-nature-50"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
