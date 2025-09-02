import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Dummy notification (replace with your Toaster if available)
function notify(msg: string) {
  alert(msg);
}

type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  age?: number;
  profession?: string;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
  [key: string]: any;
};

type Analytics = {
  today: number;
  week: number;
  month: number;
};

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Verified: "bg-green-100 text-green-800 border-green-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
};

const statusIcons: Record<string, string> = {
  Pending: "⏳",
  Verified: "✔️",
  Rejected: "❌",
};

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      setLocation("/login");
    }
  }, [setLocation]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Pending" | "Verified" | "Rejected">("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-profiles", search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      const res = await fetch(`/api/profiles?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return res.json();
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/profiles/analytics");
      if (!res.ok) return { today: 0, week: 0, month: 0 };
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: activityLog } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const res = await fetch("/api/admin/activity");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/profiles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
      notify(`Profile ${variables.status === "Verified" ? "verified" : "rejected"} successfully!`);
    },
    onError: () => {
      notify("Failed to update profile status.");
    },
  });

  const handleExportCSV = () => {
    if (!data?.profiles?.length) return;
    const csv =
      [
        Object.keys(data.profiles[0]).join(","),
        ...data.profiles.map((p: any) =>
          Object.values(p)
            .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profiles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const profiles: Profile[] = data?.profiles || [];
  const pendingProfiles = profiles.filter((p) => p.status === "Pending");
  const recentProfiles = [...profiles]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 md:p-8 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
        <button
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
          onClick={() => {
            localStorage.removeItem("isAdmin");
            setLocation("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded shadow flex flex-col items-center border border-blue-300">
          <span className="text-3xl font-bold text-blue-900">{profiles.length}</span>
          <span className="text-blue-700">Total Profiles</span>
        </div>
        <div className="bg-yellow-100 p-6 rounded shadow flex flex-col items-center border border-yellow-300">
          <span className="text-3xl font-bold text-yellow-900">{profiles.filter(p => p.status === "Pending").length}</span>
          <span className="text-yellow-700">Pending</span>
        </div>
        <div className="bg-green-100 p-6 rounded shadow flex flex-col items-center border border-green-300">
          <span className="text-3xl font-bold text-green-900">{profiles.filter(p => p.status === "Verified").length}</span>
          <span className="text-green-700">Verified</span>
        </div>
        <div className="bg-red-100 p-6 rounded shadow flex flex-col items-center border border-red-300">
          <span className="text-3xl font-bold text-red-900">{profiles.filter(p => p.status === "Rejected").length}</span>
          <span className="text-red-700">Rejected</span>
        </div>
      </div>

      {/* Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">Analytics</h2>
        <div className="flex gap-6">
          <div>Today: <span className="font-bold">{analytics?.today ?? 0}</span></div>
          <div>This Week: <span className="font-bold">{analytics?.week ?? 0}</span></div>
          <div>This Month: <span className="font-bold">{analytics?.month ?? 0}</span></div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
      </div>

      {/* Pending Profiles Queue */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">Profiles Pending Review</h2>
        {pendingProfiles.length === 0 && <div className="text-gray-500">No pending profiles.</div>}
        {pendingProfiles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Submitted</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProfiles.map(profile => (
                  <tr key={profile.id} className="hover:bg-yellow-50 transition">
                    <td className="p-2 border">{profile.name}</td>
                    <td className="p-2 border">{profile.email}</td>
                    <td className="p-2 border">{new Date(profile.createdAt).toLocaleString()}</td>
                    <td className="p-2 border">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold ${statusColors[profile.status]}`}>
                        {statusIcons[profile.status]} {profile.status}
                      </span>
                    </td>
                    <td className="p-2 border flex gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow"
                        title="Approve"
                        onClick={() => updateStatusMutation.mutate({ id: profile.id, status: "Verified" })}
                      >
                        ✔️ Verify
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                        title="Reject"
                        onClick={() => updateStatusMutation.mutate({ id: profile.id, status: "Rejected" })}
                      >
                        ❌ Reject
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                        title="View/Edit"
                        onClick={() => setSelectedProfile(profile)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">Recent Submissions</h2>
        <ul>
          {recentProfiles.map(profile => (
            <li key={profile.id} className="mb-1 flex items-center gap-2">
              <span className="font-semibold">{profile.name}</span> ({profile.email}) -{" "}
              <span className="text-gray-500">{new Date(profile.createdAt).toLocaleString()}</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold border ${statusColors[profile.status]}`}>
                {statusIcons[profile.status]} {profile.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity Log */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">Admin Activity Log</h2>
        <ul>
          {(activityLog ?? []).map((log: any, i: number) => (
            <li key={i} className="text-sm text-gray-700 mb-1">
              {log.action} on profile <b>{log.profileName}</b> at {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
          {(!activityLog || activityLog.length === 0) && <li>No recent admin actions.</li>}
        </ul>
      </div>

      {/* Profile Details/Edit Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setSelectedProfile(null)}
              title="Close"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Profile Details</h3>
            <div className="mb-2"><b>Name:</b> {selectedProfile.name}</div>
            <div className="mb-2"><b>Email:</b> {selectedProfile.email}</div>
            <div className="mb-2"><b>Phone:</b> {selectedProfile.phone ?? "-"}</div>
            <div className="mb-2"><b>Address:</b> {selectedProfile.address ?? "-"}</div>
            <div className="mb-2"><b>Age:</b> {selectedProfile.age ?? "-"}</div>
            <div className="mb-2"><b>Profession:</b> {selectedProfile.profession ?? "-"}</div>
            <div className="mb-2"><b>Status:</b> 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold border ${statusColors[selectedProfile.status]}`}>
                {statusIcons[selectedProfile.status]} {selectedProfile.status}
              </span>
            </div>
            {/* Add more fields and edit form as needed */}
            <div className="mt-4 flex gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow"
                onClick={() => {
                  updateStatusMutation.mutate({ id: selectedProfile.id, status: "Verified" });
                  setSelectedProfile(null);
                }}
              >
                ✔️ Verify
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                onClick={() => {
                  updateStatusMutation.mutate({ id: selectedProfile.id, status: "Rejected" });
                  setSelectedProfile(null);
                }}
              >
                ❌ Reject
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded shadow"
                onClick={() => setSelectedProfile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}