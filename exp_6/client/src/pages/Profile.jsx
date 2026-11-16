import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getProfile } from "../services/api";

function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?._id) return;
      try {
        setLoading(true);
        setError("");
        const data = await getProfile(user._id);
        setProfileData(data.profile || data);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                User Profile
              </h1>
              <p className="text-sm text-slate-500">
                Experiment / Assignment: Broken Access Control (IDOR) Assessment
              </p>
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center text-slate-600">
              Loading profile details...
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && profileData && (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Profile Resource ID
                </span>
                <p className="mt-1 font-mono text-base font-bold text-indigo-700 select-all">
                  {profileData._id}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Inspected in Network Tab: GET /api/profiles/{profileData._id}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Full Name
                  </span>
                  <p className="mt-1 text-lg font-medium text-slate-900">
                    {profileData.name}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email Address
                  </span>
                  <p className="mt-1 text-lg font-medium text-slate-900">
                    {profileData.email}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Assigned Role
                  </span>
                  <p className="mt-1">
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {profileData.role || "user"}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Account Created
                  </span>
                  <p className="mt-1 text-sm text-slate-700">
                    {profileData.createdAt
                      ? new Date(profileData.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
