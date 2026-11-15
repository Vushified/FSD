import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
  }

  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold"
        >
          EventHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="transition hover:text-indigo-400"
          >
            Home
          </Link>
          <Link
            to="/events"
            className="transition hover:text-indigo-400"
          >
            Events
          </Link>

          {user ? (
            <>
              <Link
                to="/my-registrations"
                className="transition hover:text-indigo-400"
              >
                My Registrations
              </Link>
              <span className="text-sm text-slate-300">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="transition hover:text-indigo-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-600 px-3 py-2 md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-700 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={closeMenu}
            >
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-registrations"
                  onClick={closeMenu}
                >
                  My Registrations
                </Link>
                <p className="text-sm text-slate-300">
                  Logged in as {user.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
