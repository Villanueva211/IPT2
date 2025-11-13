import React, { useEffect, useState } from "react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState({ name: "", email: "", avatar_url: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [pwd, setPwd] = useState({ current_password: "", password: "", password_confirmation: "" });
  const token = localStorage.getItem("token");

  const api = async (url, opts = {}) => {
    const res = await fetch(url, {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(opts.headers?.["Content-Type"] ? { "Content-Type": opts.headers["Content-Type"] } : {})
      },
      credentials: "include",
    });
    if (!res.ok) throw await res.json().catch(() => ({ message: res.statusText }));
    return res.json();
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await api("http://127.0.0.1:8000/api/profile");
        setMe(data);
        setName(data.name);
        setEmail(data.email);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    const data = await api("http://127.0.0.1:8000/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setMe((m) => ({ ...m, ...data.user }));
    alert("Profile updated.");
  };

  const savePassword = async (e) => {
    e.preventDefault();
    await api("http://127.0.0.1:8000/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pwd),
    });
    setPwd({ current_password: "", password: "", password_confirmation: "" });
    alert("Password updated.");
  };

  const onAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const uploadAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    const form = new FormData();
    form.append("avatar", avatarFile);
    const res = await fetch("http://127.0.0.1:8000/api/profile/avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      credentials: "include",
      body: form,
    });
    if (!res.ok) throw await res.json().catch(() => ({ message: res.statusText }));
    const data = await res.json();
    setMe((m) => ({ ...m, avatar_url: data.avatar_url }));
    setAvatarPreview(null);
    setAvatarFile(null);
    alert("Avatar updated.");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Profile Photo</h2>
          <img
            src={avatarPreview || me.avatar_url}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border mb-3"
          />
          <form onSubmit={uploadAvatar}>
            <input type="file" accept="image/*" onChange={onAvatarChange} className="mb-3" />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!avatarFile}
            >
              Upload
            </button>
          </form>
        </div>

        {/* Name & Email */}
        <div className="bg-white rounded shadow p-4 md:col-span-2">
          <h2 className="font-semibold mb-3">Account Info</h2>
          <form onSubmit={saveProfile} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded shadow p-4 md:col-span-3">
          <h2 className="font-semibold mb-3">Change Password</h2>
          <form onSubmit={savePassword} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input type="password" className="w-full border rounded px-3 py-2"
                     value={pwd.current_password}
                     onChange={(e)=>setPwd({...pwd, current_password: e.target.value})}
                     required />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input type="password" className="w-full border rounded px-3 py-2"
                     value={pwd.password}
                     onChange={(e)=>setPwd({...pwd, password: e.target.value})}
                     required />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input type="password" className="w-full border rounded px-3 py-2"
                     value={pwd.password_confirmation}
                     onChange={(e)=>setPwd({...pwd, password_confirmation: e.target.value})}
                     required />
            </div>
            <div className="md:col-span-3">
              <button className="bg-purple-600 text-white px-4 py-2 rounded">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
